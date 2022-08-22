import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { isDev } from '../config';
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

// TODO: Audit scopes. Are there any we can remove?
const scopes = [
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

// The client *must* be created afresh for each request. Otherwise, concurrent
// requests could end up sharing tokens.
function createOAuth2Client() {
  if (!keys) throw new Error('OAuth2 keys file missing');
  return new OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );
}
