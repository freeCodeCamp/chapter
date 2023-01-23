import { NextFunction, Response } from 'express';
import { Prisma } from '@prisma/client';

import { Request } from '../../common-types/gql';
import { prisma } from '../../prisma';

const userInclude = {
  include: {
    user_bans: true,
    user_chapters: {
      include: {
        chapter_role: {
          include: {
            chapter_role_permissions: {
              include: { chapter_permission: true },
            },
          },
        },
      },
    },
    user_events: {
      include: {
        event: {
          select: {
            chapter_id: true,
          },
        },
        event_role: {
          include: {
            event_role_permissions: {
              include: { event_permission: true },
            },
          },
        },
      },
    },
    instance_role: {
      include: {
        instance_role_permissions: {
          include: { instance_permission: true },
        },
      },
    },
  },
};

type Merge<T> = {
  [Key in keyof T]: T[Key];
};

export type User = Merge<Prisma.usersGetPayload<typeof userInclude>>;
export type Events = Merge<
  Prisma.eventsGetPayload<{ select: { id: true; chapter_id: true } }>[]
>;
export type Venues = Merge<
  Prisma.venuesGetPayload<{ select: { id: true; chapter_id: true } }>[]
>;

const findAndAddUser = async (
  req: Request,
  next: NextFunction,
  { sessionId }: { sessionId: number },
) => {
  // While we can't make a findUnique call here (sessions.id is not in users),
  // there is a 1-1 relationship between user and session. So, if a session
  // exists, there can only be one user with that session.
  const user = await prisma.users.findFirst({
    where: { session: { id: sessionId } },
    ...userInclude,
  });

  if (!user) {
    req.session = null;
    return next();
  }

  const [venues, events] = await Promise.all([
    prisma.venues.findMany({
      select: { id: true, chapter_id: true },
      where: {
        chapter: { chapter_users: { some: { user_id: user.id } } },
      },
    }),
    prisma.events.findMany({
      select: { id: true, chapter_id: true },
      where: { chapter: { chapter_users: { some: { user_id: user.id } } } },
    }),
  ]);

  req.user = user;
  req.venues = venues;
  req.events = events;
  next();
};

export const user = (req: Request, _res: Response, next: NextFunction) => {
  const sessionId: number = req.session?.id;

  // user is not logged in, so we will not be adding user to the request and can
  // move on
  if (!sessionId) return next();
  findAndAddUser(req, next, { sessionId });
};

export function handleError(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  if (err) {
    return res.status(500).send({
      message: 'Something went Wrong',
    });
  }
}
