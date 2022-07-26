import fetch from 'node-fetch';
import { isDev } from '../config';
import { prisma } from '../prisma';

export function fetchUserInfo(token: string): Promise<{ email?: string }> {
  // TODO: the dev-only code is scattered across several files. Is it possible
  // to use, say, passport and confine the code to individual strategies?
  if (isDev()) {
    return prisma.sessions.findFirstOrThrow().then(async (sessionUser) => {
      return await prisma.users.findFirstOrThrow({
        where: {
          id: sessionUser.user_id,
        },
        select: {
          email: true,
        },
      });
    });
  } else {
    return fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }
}
