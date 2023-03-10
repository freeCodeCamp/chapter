import fs from 'fs';
import path from 'path';

import { Credentials, OAuth2Client } from 'google-auth-library';
import { calendar } from '@googleapis/calendar';

import { prisma } from '../prisma';
import { redactSecrets } from '../util/redact-secrets';

// We need a single set of tokens for the server and Prisma needs a unique id
// to update the tokens. This is it.
const TOKENS_ID = 1;

const scopes: string[] = [
  // We need to insert calendars, so we need the full scope (rather than more restricted scopes like 'calendar.events').
  'https://www.googleapis.com/auth/calendar',
  // We need the user's email to check if they are the same user as when the tokens were first created.
  'https://www.googleapis.com/auth/userinfo.email',
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
    console.warn(
      'WARN: oauth2.keys.json file missing, the Google Calendar integration will not work.',
    );
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
async function onTokens(
  tokens: Credentials,
  { requireRefreshToken }: { requireRefreshToken?: boolean } = {
    requireRefreshToken: false,
  },
) {
  // TODO: handle the case where the user rejects some or all of the scopes
  const { access_token, refresh_token, expiry_date } = tokens;

  if (!access_token || !expiry_date) throw new Error('Tokens invalid');
  if (requireRefreshToken && !refresh_token)
    throw new Error('Missing refresh_token');

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
  } else if (existingGoogleTokens) {
    const update = { access_token, expiry_date, is_valid: true };
    await prisma.google_tokens.update({
      where: { id: TOKENS_ID },
      data: { ...update },
    });
  } else {
    // This should not happen, but if it did, presumably something went
    // wrong during the Google authentication flow. All we can do is ask the
    // user to try again.
    throw new Error('Missing refresh_token');
  }
}

export async function requestTokens(code: string) {
  const oauth2Client = createOAuth2Client();
  try {
    const tokens = (await oauth2Client.getToken(code)).tokens;
    await onTokens(tokens, { requireRefreshToken: true });
  } catch (e) {
    console.error('Failed to get tokens');
    throw redactSecrets(e);
  }
}

export function getGoogleAuthUrl(state: string, prompt = false) {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
    ...(prompt && { prompt: 'consent' }),
  });
}

interface TokenInfo {
  access_token: string;
  expiry_date: bigint;
  id: number;
  refresh_token: string;
}

async function createCredentialedClient(tokenInfo: TokenInfo) {
  const oauth2Client = createOAuth2Client().on('tokens', onTokens);

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
export async function createCalendarApi(tokenInfo?: TokenInfo) {
  const tokens =
    tokenInfo ??
    (await prisma.google_tokens.findFirstOrThrow({
      where: { is_valid: true },
    }));
  const auth = await createCredentialedClient(tokens);
  return calendar({ version: 'v3', auth });
}

export async function createCalendarApis() {
  const tokensInfo = await prisma.google_tokens.findMany({
    where: { is_valid: true },
  });
  return await Promise.all(
    tokensInfo.map(async (tokenInfo) => ({
      tokenId: tokenInfo.id,
      calendarApi: await createCalendarApi(tokenInfo),
    })),
  );
}

export async function invalidateToken(tokenId?: number) {
  await prisma.google_tokens.update({
    data: { is_valid: false },
    where: { id: tokenId || TOKENS_ID },
  });
}
