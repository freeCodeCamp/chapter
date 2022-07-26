import { NextFunction, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError, verify } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

import { Request } from '../../common-types/gql';
import { getConfig } from '../../config';
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
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const { error } = verifyToken(authorization);
  if (error) return next(error);

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

export const userMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const { error, id } = verifyToken(authorization);
  if (error) return next(error);

  prisma.users
    .findUnique({
      where: { id },
      ...userInclude,
    })
    .then((user) => {
      if (!user) {
        return next('User not found');
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

function verifyToken(authorization: string) {
  // We don't, currently, handle different JsonWebTokenError messages
  // differently but we do need to add messages to the error object.
  const raw = authorization.split(' ');
  if (raw.length != 2 || raw[0] != 'Bearer') {
    return { error: new JsonWebTokenError('Invalid auth header') };
  }

  const value = verify(raw[1], getConfig('JWT_SECRET')) as { id: number };
  if (!value.id) {
    return { error: new JsonWebTokenError('Missing contents') };
  }

  return { id: value.id };
}

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
  } else {
    return res.status(401).send({
      message: 'User not found',
    });
  }
}
