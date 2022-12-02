import fs from 'fs';
import path from 'path';
import { Credentials, OAuth2Client } from 'google-auth-library';
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

function createOAuth2Client() {
  if (!keys) throw new Error('OAuth2 keys file missing');
  return new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );
}

export function getGoogleAuthUrl(state: string) {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
  });
}

// TODO: Communicate these errors to the user. As of now, if the user
// authenticates, and an error is thrown here, they will still see
// Authentication successful in the browser.
async function onTokens(tokens: Credentials) {
  // TODO: handle the case where the user rejects some or all of the scopes
  const { access_token, refresh_token, expiry_date } = tokens;

  if (!access_token || !expiry_date) throw new Error('Tokens invalid');

  let userInfo;
  try {
    userInfo = await createOAuth2Client().getTokenInfo(access_token);
  } catch {
    throw new Error('Failed to get user info');
  }

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
    // record doesn't exist. If this happens, we need to redirect them to a
    // new auth url, but with prompt: 'consent', so that Google will provide
    // a new refresh token.
    await prisma.google_tokens.update({
      where: { id: TOKENS_ID },
      data: { ...update },
    });
  }
}

export async function requestTokens(code: string) {
  const oauth2Client = createOAuth2Client().on('tokens', onTokens);

  try {
    await oauth2Client.getToken(code);
  } catch {
    throw new Error('Failed to get tokens');
  }
}

async function createCredentialedClient() {
  const oauth2Client = createOAuth2Client().on('tokens', onTokens);

  const tokenInfo = await prisma.google_tokens.findFirstOrThrow();
  const tokens = {
    access_token: tokenInfo.access_token,
    refresh_token: tokenInfo.refresh_token,
    // Awkwardly, Prisma is setting the type to bigint, but it's really an 8 byte
    // integer in the database.
    expiry_date: tokenInfo.expiry_date as unknown as number,
  };
  // We need to set all the credentials on the client, not just the access
  // token. That way the client will use the access token if it's available and
  // not about to expire, but will refresh otherwise.
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

// It's not necessary to recreate the client for each request, but it is safer.
// If multiple tokens end up being used, it will be important to use the
// appropriate one for that request.
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
  start?: Date;
  end?: Date;
  summary?: string;
  attendees?: calendar_v3.Schema$EventAttendee[];
  status?: 'cancelled';
}

function parseEventData({
  attendees,
  start,
  end,
  summary,
}: Partial<EventData>): calendar_v3.Schema$Event {
  return {
    ...(start && { start: { dateTime: start.toISOString() } }),
    ...(end && { end: { dateTime: end.toISOString() } }),
    ...(summary && { summary }),
    // Since Google will send emails to these addresses, we don't want to
    // accidentally send emails in testing.
    ...(attendees ?? { attendees: isProd() ? attendees : [] }),
  };
}

function createEventRequestBody({
  attendees,
  start,
  end,
  summary,
}: EventData): calendar_v3.Schema$Event {
  return {
    ...parseEventData({ attendees, start, end, summary }),
    guestsCanSeeOtherGuests: false,
    guestsCanInviteOthers: false,
  };
}

interface CalendarId {
  calendarId: string;
}

export async function createCalendarEvent(
  { calendarId }: CalendarId,
  eventData: EventData,
) {
  const calendarApi = await createCalendarApi();

  const { data } = await calendarApi.events.insert({
    calendarId,
    sendUpdates: 'all',
    requestBody: createEventRequestBody(eventData),
  });

  return { calendarEventId: data.id };
}

interface EventIds {
  calendarId: string;
  calendarEventId: string;
}

async function getAndUpdateEvent(
  { calendarId, calendarEventId: eventId }: EventIds,
  update: EventData | null,
  updateAttendees?: (
    attendees?: calendar_v3.Schema$EventAttendee[],
  ) => calendar_v3.Schema$EventAttendee[] | undefined,
) {
  const calendarApi = await createCalendarApi();

  const { data } = await calendarApi.events.get({
    calendarId,
    eventId,
  });

  const { attendees } = data;

  const updatedAttendeesData = updateAttendees
    ? updateAttendees(attendees)
    : attendees;

  const requestBodyUpdates: EventData = {
    ...update,
    ...{ attendees: updatedAttendeesData },
  };

  await calendarApi.events.update({
    calendarId,
    eventId,
    sendUpdates: 'all',
    requestBody: { ...data, ...createEventRequestBody(requestBodyUpdates) },
  });
}

// To be used to update event, but not the attendees.
export async function updateCalendarEvent(
  { calendarId, calendarEventId }: EventIds,
  eventUpdateData: EventData,
) {
  await getAndUpdateEvent({ calendarId, calendarEventId }, eventUpdateData);
}

// TODO: use alias for id and ids
export async function cancelCalendarEvent({
  calendarId,
  calendarEventId,
}: EventIds) {
  await getAndUpdateEvent(
    { calendarId, calendarEventId },
    { status: 'cancelled' },
  );
}

function filterFromAttendees(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[]) =>
    attendees.filter((attendee) => attendee.email === email);
}

function addToAttendees(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[] = []) =>
    attendees.concat({ email });
}

function cancelAttendance(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[] = []) =>
    attendees.map((attendee) =>
      attendee.email === email
        ? { ...attendee, responseStatus: 'declined' }
        : attendee,
    );
}

interface Attendee {
  attendeeEmail: string;
}

export async function removeEventAttendee(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    filterFromAttendees(attendeeEmail),
  );
}

export async function cancelEventAttendance(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    cancelAttendance(attendeeEmail),
  );
}

export async function addEventAttendee(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    addToAttendees(attendeeEmail),
  );
}

export async function deleteCalendarEvent({
  calendarId,
  calendarEventId: eventId,
}: EventIds) {
  const calendarApi = await createCalendarApi();

  await calendarApi.events.delete({
    calendarId,
    eventId,
    sendUpdates: 'all',
  });
}
