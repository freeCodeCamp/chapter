import fetch from 'node-fetch';

export function fetchUserInfo(token: string): Promise<{ email?: string }> {
  return fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
