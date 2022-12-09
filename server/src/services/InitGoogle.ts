import fs from 'fs';
import path from 'path';

import { Credentials, OAuth2Client } from 'google-auth-library';
import { calendar } from '@googleapis/calendar';

import { prisma } from '../prisma';
import { isProd } from '../config';

// We need a single set of tokens for the server and Prisma needs a unique id
// to update the tokens. This is it.
const TOKENS_ID = 1;

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

function createOAuth2Client() {
  if (!keys) throw new Error('OAuth2 keys file missing');
  return new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );
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
    const update = {
      access_token,
      refresh_token,
      expiry_date,
      email,
      is_valid: true,
    };
    await prisma.google_tokens.upsert({
      where: { id: TOKENS_ID },
      update,
      create: { id: TOKENS_ID, ...update },
    });
  } else {
    const update = { access_token, expiry_date, is_valid: true };
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

export function getGoogleAuthUrl(state: string) {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
  });
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
export async function createCalendarApi() {
  const auth = await createCredentialedClient();
  return calendar({ version: 'v3', auth });
}
