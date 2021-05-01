import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getConfig } from 'server/config';
import { User } from 'server/models';
import { Request } from '../../ts/gql';

export const userMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const raw = authorization.split(' ');
  if (raw.length != 2 || raw[0] != 'Bearer') {
    // TODO: Handle this better
    return next('Auth header wrong');
  }

  const value = verify(raw[1], getConfig('JWT_SECRET')) as { id: number };
  if (!value.id) {
    return next('Token malformed');
  }

  User.findOne({ where: { id: value.id } })
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
