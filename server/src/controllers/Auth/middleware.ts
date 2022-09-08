import { NextFunction, Response } from 'express';
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
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
        user: true,
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

export const events = (req: Request, _res: Response, next: NextFunction) => {
  const id = req.session?.id;

  // user is not logged in, so we don't need to do anything here
  if (!id) {
    return next();
  }

  prisma.events
    .findMany({
      select: {
        id: true,
        chapter_id: true,
      },
    })
    .then((events) => {
      req.events = events;
      next();
    });
};

export const user = (req: Request, _res: Response, next: NextFunction) => {
  const id = req.session?.id;

  // user is not logged in, so we will not be adding user to the request and can
  // move on
  if (!id) return next();

  // While we can't make a findUnique call here (sessions.id is not in users),
  // there is a 1-1 relationship between user and session. So, if a session
  // exists, there can only be one user with that session.
  prisma.users
    .findFirst({
      where: { session: { id } },
      ...userInclude,
    })
    .then((user) => {
      if (!user) {
        // if the session user does not exist in the db, the session is invalid
        req.session = null;
        return next('User not found');
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

// TODO: is this necessary now everything is handled by Auth0 and cookie-session?
export function handleAuthenticationError(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      message: 'Token expired',
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(401).send({
      message: 'Token invalid',
    });
  } else if (err instanceof NotBeforeError) {
    return res.status(401).send({
      message: 'Token Not Active',
    });
  } else if (err instanceof UnauthorizedError) {
    return res.status(401).send({
      message: 'User Not Authorized',
    });
  } else {
    return res.status(401).send({
      message: 'User not found',
    });
  }
}

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
    return res.status(401).send({
      message: 'Something went Wrong',
    });
  }
}
