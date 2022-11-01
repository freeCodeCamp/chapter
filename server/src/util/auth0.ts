import { readFile } from 'fs/promises';
import { resolve } from 'path';
import fetch from 'node-fetch';

export function fetchUserInfo(token: string): Promise<{ email?: string }> {
  // TODO: the dev-only code is scattered across several files. Is it possible
  // to use, say, passport and confine the code to individual strategies?
  if (process.env.USE_AUTH0 === 'false') {
    const devDataFile = resolve(
      __dirname,
      '../../../scripts/dev-data/current-user.json',
    );
    return readFile(devDataFile, 'utf8').then(JSON.parse);
  } else {
    return fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }
}
