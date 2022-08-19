import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { isDev } from '../config';

function init() {
  let oauth2Client = null;
  try {
    const keyPath = path.join(__dirname, '../../keys/oauth2.keys.json');
    const keys: {
      client_id: string;
      client_secret: string;
      redirect_uris: string[];
    } = JSON.parse(fs.readFileSync(keyPath, 'utf8')).web;

    oauth2Client = new OAuth2Client(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris[0],
    );
  } catch {
    if (!isDev())
      throw new Error('OAuth2 keys file missing, cannot start server');
  }

  return { oauth2Client };
}

const { oauth2Client } = init();

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
  if (!oauth2Client) throw new Error('oauth2Client is not initialized');
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
  });
}

export async function getGoogleTokens(code: string) {
  if (!oauth2Client) throw new Error('oauth2Client is not initialized');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client?.setCredentials(tokens);
  } catch (err) {
    throw 'Unable to get google auth tokens';
  }
  // TODO: store this in the DB and use it on subsequent requests
}
