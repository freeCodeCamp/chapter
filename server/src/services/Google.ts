import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { calendar } from '@googleapis/calendar';
import { isDev, isProd } from '../config';
import { prisma } from '../prisma';

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
    if (!isDev())
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
export async function storeGoogleTokens(code: string, userId: number) {
  const oauth2Client = createOAuth2Client();

  let tokens;
  try {
    const tokenRes = await oauth2Client.getToken(code);
    tokens = tokenRes.tokens;
  } catch {
    throw new Error('Failed to get tokens');
  }

  // TODO: handle the case where the user rejects some or all of the scopes
  const { access_token, refresh_token, expiry_date } = tokens;

  if (!access_token || !expiry_date) throw new Error('Tokens invalid');

  if (refresh_token) {
    const update = { access_token, refresh_token, expiry_date };
    await prisma.google_tokens.upsert({
      where: { user_id: userId },
      update: { ...update },
      create: { user_id: userId, ...update },
    });
  } else {
    const update = { access_token, expiry_date };
    // TODO: Handle the case where the refresh token is not sent *and* the
    // record doesn't exist. We can make refresh_token nullable and that may be
    // the best solution.
    await prisma.google_tokens.update({
      where: { user_id: userId },
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
async function createCredentialedClient(userId: number) {
  const oauth2Client = createOAuth2Client();
  const { access_token } = await prisma.google_tokens.findUniqueOrThrow({
    where: { user_id: userId },
  });
  oauth2Client.setCredentials({ access_token });
  return oauth2Client;
}

interface CalendarData {
  summary: string;
  description: string;
}

export async function createCalendar(
  currentUserId: number,
  { summary, description }: CalendarData,
) {
  // The client *must* be created afresh for each request. Otherwise, concurrent
  // requests could end up sharing tokens.
  const auth = await createCredentialedClient(currentUserId);
  const googleCalendar = calendar({ version: 'v3', auth });

  const { data } = await googleCalendar.calendars.insert({
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

export async function createCalendarEvent(
  currentUserId: number,
  { eventId }: { eventId: number },
  { calendarId, start, end, summary, attendeeEmails }: EventData,
) {
  const auth = await createCredentialedClient(currentUserId);
  const googleCalendar = calendar({ version: 'v3', auth });

  // Since this Goggle will send emails to these addresses, we don't want to
  // accidentally send emails in testing.
  const attendees = isProd()
    ? attendeeEmails.map((email: string) => ({ email }))
    : [];
  const { data } = await googleCalendar.events.insert({
    calendarId,
    sendUpdates: 'all',
    requestBody: {
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      summary,
      attendees,
    },
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

interface ChapterData {
  chapterId: number;
  targetUserId: number;
}

interface AccessData {
  calendarId: string;
}

export async function grantCalendarAccess(
  currentUserId: number,
  { chapterId, targetUserId }: ChapterData,
  { calendarId }: AccessData,
) {
  const auth = await createCredentialedClient(currentUserId);
  const googleCalendar = calendar({ version: 'v3', auth });

  const targetUser = await prisma.users.findUniqueOrThrow({
    where: { id: targetUserId },
    select: { email: true },
  });

  const { data } = await googleCalendar.acl
    .insert({
      calendarId,
      requestBody: {
        role: 'writer',
        scope: {
          type: 'user',
          value: targetUser.email,
        },
      },
    })
    .catch(() => {
      throw new Error('Failed to grant calendar access');
    });

  await prisma.chapter_users.update({
    where: {
      user_id_chapter_id: { user_id: targetUserId, chapter_id: chapterId },
    },
    data: { calendar_acl_id: data.id },
  });
}

export async function revokeCalendarAccess(
  currentUserId: number,
  { chapterId, targetUserId }: ChapterData,
  { calendarId }: AccessData,
) {
  const auth = await createCredentialedClient(currentUserId);
  const googleCalendar = calendar({ version: 'v3', auth });

  // TODO: if possible, it would be nice to update and get the previous value in
  // one query.
  const { calendar_acl_id } = await prisma.chapter_users.findUniqueOrThrow({
    where: {
      user_id_chapter_id: { user_id: targetUserId, chapter_id: chapterId },
    },
    select: { calendar_acl_id: true },
  });

  // TODO: warn if the ACL id doesn't exist?
  if (calendar_acl_id === null) return;

  await prisma.chapter_users.update({
    where: {
      user_id_chapter_id: { user_id: targetUserId, chapter_id: chapterId },
    },
    data: { calendar_acl_id: null },
  });

  try {
    await googleCalendar.acl.delete({
      calendarId,
      ruleId: calendar_acl_id,
    });
  } catch (err) {
    throw new Error('Failed to revoke calendar access');
  }
}
