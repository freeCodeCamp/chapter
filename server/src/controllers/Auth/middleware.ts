import { NextFunction, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError, verify } from 'jsonwebtoken';

import { Request } from '../../common-types/gql';
import { getConfig } from '../../config';
import { prisma } from '../../prisma';

export const userMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  // We don't, currently, handle different JsonWebTokenError messages
  // differently but we do need to add messages to the error object.
  const raw = authorization.split(' ');
  if (raw.length != 2 || raw[0] != 'Bearer') {
    return next(new JsonWebTokenError('Invalid auth header'));
  }

  const value = verify(raw[1], getConfig('JWT_SECRET')) as { id: number };
  if (!value.id) {
    return next(new JsonWebTokenError('Missing contents'));
  }

  prisma.users
    .findUnique({
      where: { id: value.id },
      include: {
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
      rejectOnNotFound: false,
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
