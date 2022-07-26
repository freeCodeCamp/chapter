import fetch from 'node-fetch';
import { isDev } from '../config';

import { email } from '../../dev-data.json';

export function fetchUserInfo(token: string): Promise<{ email?: string }> {
  // TODO: the dev-only code is scattered across several files. Is it possible
  // to use, say, passport and confine the code to individual strategies?
  if (isDev()) {
    return Promise.resolve({ email });
  } else {
    return fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }
}
