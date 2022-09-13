import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { calendar, calendar_v3 } from '@googleapis/calendar';
import { isProd } from '../config';
import { prisma } from '../prisma';

// We need a single set of tokens for the server and Prisma needs a unique id
// to update the tokens. This is it.
const TOKENS_ID = 1;

function init() {
  try {
    const keyPath = path.join(__dirname, '../../keys/oauth2.keys.json');
    const keys: {
      client_id: string;
      client_secret: string;
      redirect_uris: string[];
    } = JSON.parse(fs.readFileSync(keyPath, 'utf8')).web;

    return { keys };
  } catch {
    if (isProd())
      throw new Error('OAuth2 keys file missing, cannot start server');
  }

  return {};
}

const { keys } = init();

// TODO: Audit scopes. Are there any we can remove? Once the audit is complete
// ensure the project provides only these scopes.
const scopes = [
  'https://www.googleapis.com/auth/calendar.acls',
  'https://www.googleapis.com/auth/calendar.app.created',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/userinfo.email',
  'profile',
];

export function getGoogleAuthUrl(state: string) {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
  });
}

// TODO: skip calling this if the user already has a valid, non-expired token
export async function storeGoogleTokens(code: string) {
  const oauth2Client = createOAuth2Client();

  let tokens, userInfo;
  try {
    const tokenRes = await oauth2Client.getToken(code);
    tokens = tokenRes.tokens;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userInfo = await oauth2Client.getTokenInfo(tokens.access_token!);
  } catch {
    throw new Error('Failed to get tokens');
  }

  // TODO: handle the case where the user rejects some or all of the scopes
  const { access_token, refresh_token, expiry_date } = tokens;

  if (!access_token || !expiry_date) throw new Error('Tokens invalid');

  const { email } = userInfo;

  if (!email) throw new Error('User email not found');

  const existingGoogleTokens = await prisma.google_tokens.findUnique({
    where: { id: TOKENS_ID },
  });

  const existingEmail = existingGoogleTokens?.email;

  if (existingEmail && existingEmail !== email) {
    throw new Error(
      'You must authenticate with the Google account used when setting up',
    );
  }

  if (refresh_token) {
    const update = { access_token, refresh_token, expiry_date, email };
    await prisma.google_tokens.upsert({
      where: { id: TOKENS_ID },
      update,
      create: { id: TOKENS_ID, ...update },
    });
  } else {
    const update = { access_token, expiry_date };
    // TODO: Handle the case where the refresh token is not sent *and* the
    // record doesn't exist. We can make refresh_token nullable and that may be
    // the best solution.
    await prisma.google_tokens.update({
      where: { id: TOKENS_ID },
      data: { ...update },
    });
  }
}

function createOAuth2Client() {
  if (!keys) throw new Error('OAuth2 keys file missing');
  return new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );
}

// TODO: use refresh tokens to get a new access token if the existing one is
// expired or about to expire.
async function createCredentialedClient() {
  const oauth2Client = createOAuth2Client();
  const { access_token } = await prisma.google_tokens.findFirstOrThrow();
  oauth2Client.setCredentials({ access_token });
  return oauth2Client;
}

// The client *must* be created afresh for each request. Otherwise, concurrent
// requests could end up sharing tokens.
async function createCalendarApi() {
  const auth = await createCredentialedClient();
  return calendar({ version: 'v3', auth });
}

interface CalendarData {
  summary: string;
  description: string;
}

export async function createCalendar({ summary, description }: CalendarData) {
  const calendarApi = await createCalendarApi();

  const { data } = await calendarApi.calendars.insert({
    requestBody: {
      summary,
      description,
    },
  });

  return data;
}

interface EventData {
  calendarId: string;
  start: Date;
  end: Date;
  summary: string;
  attendeeEmails: string[];
}

interface EventUpdateData extends EventData {
  calendarEventId: string;
}

export async function createCalendarEvent(
  { eventId }: { eventId: number },
  eventData: EventData,
) {
  const calendarApi = await createCalendarApi();

  const { calendarId } = eventData;
  const { data } = await calendarApi.events.insert({
    calendarId,
    sendUpdates: 'all',
    requestBody: getStandardRequestBody(eventData),
  });

  await prisma.events.update({
    where: {
      id: eventId,
    },
    data: {
      calendar_event_id: data.id,
    },
  });
}

// TODO: create a patchCalendarEvent for updating specific fields (most useful
// for RSVPs which only modify the attendees list)
export async function updateCalendarEvent(eventUpdateData: EventUpdateData) {
  const calendarApi = await createCalendarApi();

  const { calendarId, calendarEventId } = eventUpdateData;
  await calendarApi.events.update({
    calendarId,
    eventId: calendarEventId,
    sendUpdates: 'all',
    requestBody: getStandardRequestBody(eventUpdateData),
  });
}

export async function patchCalendarEvent(
  eventUpdateData: Partial<EventUpdateData>,
) {
  const calendarApi = await createCalendarApi();

  const { calendarId, calendarEventId } = eventUpdateData;

  await calendarApi.events.patch({
    calendarId,
    eventId: calendarEventId,
    sendUpdates: 'all',
    requestBody: getStandardPatchBody(eventUpdateData),
  });
}

export async function cancelCalendarEvent(eventUpdateData: EventUpdateData) {
  const calendarApi = await createCalendarApi();
  const { calendarId, calendarEventId } = eventUpdateData;
  await calendarApi.events.update({
    calendarId,
    eventId: calendarEventId,
    sendUpdates: 'all',
    requestBody: {
      ...getStandardRequestBody(eventUpdateData),
      status: 'cancelled',
    },
  });
}

// TODO: DRY this and getStandardPatchBody
function getStandardRequestBody({
  attendeeEmails,
  start,
  end,
  summary,
}: EventData) {
  // Since this Goggle will send emails to these addresses, we don't want to
  // accidentally send emails in testing.
  const attendees = isProd()
    ? attendeeEmails.map((email: string) => ({ email }))
    : [];
  const body: calendar_v3.Schema$Event = {
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    summary,
    attendees,
    guestsCanSeeOtherGuests: false,
    guestsCanInviteOthers: false,
  };
  return body;
}

function getStandardPatchBody({
  attendeeEmails,
  start,
  end,
  summary,
}: Partial<EventData>): calendar_v3.Schema$Event {
  const body: calendar_v3.Schema$Event = {};
  if (start) body.start = { dateTime: start.toISOString() };
  if (end) body.end = { dateTime: end.toISOString() };
  if (summary) body.summary = summary;
  if (attendeeEmails)
    body.attendees = isProd()
      ? attendeeEmails.map((email: string) => ({ email }))
      : [];
  return body;
}

export async function deleteCalendarEvent({
  calendarId,
  calendarEventId,
}: {
  calendarId: string;
  calendarEventId: string;
}) {
  const calendarApi = await createCalendarApi();

  await calendarApi.events.delete({
    calendarId,
    eventId: calendarEventId,
    sendUpdates: 'all',
  });
}
