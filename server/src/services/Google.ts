import fs from 'fs';
import path from 'path';
// TODO: only install and use the required libraries (calendar and auth)
import { google } from 'googleapis';

function init() {
  let keys: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  try {
    const keyPath = path.join(__dirname, '../../keys/oauth2.keys.json');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keys = JSON.parse(fs.readFileSync(keyPath, 'utf8')).web;
  } catch {
    throw new Error('OAuth2 keys file missing, cannot start server');
  }

  const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );

  google.options({ auth: oauth2Client });

  return { oauth2Client, calendar: google.calendar('v3') };
}

const { oauth2Client, calendar } = init();

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

export function createEvent() {
  console.log(calendar);
  return null;
}
