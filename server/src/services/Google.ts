import fs from 'fs';
import path from 'path';
// TODO: only install and use the required libraries (calendar and auth)
import { google } from 'googleapis';
import { isDev } from '../config';

function init() {
  let oauth2Client;
  try {
    const keyPath = path.join(__dirname, '../../keys/oauth2.keys.json');
    const keys: {
      client_id: string;
      client_secret: string;
      redirect_uris: string[];
    } = JSON.parse(fs.readFileSync(keyPath, 'utf8')).web;

    oauth2Client = new google.auth.OAuth2(
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
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state,
  });
}

// TODO: expose functions not the full client
export { oauth2Client };
