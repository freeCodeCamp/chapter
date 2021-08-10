import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getConfig } from 'src/config';
import { User } from 'src/models';
import { Request } from 'src/common-types/gql';

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

  User.findOne(value.id, { relations: ['chapter_roles'] })
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
