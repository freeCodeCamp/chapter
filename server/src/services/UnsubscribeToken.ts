import { sign } from 'jsonwebtoken';

import { getConfig } from '../config';

export enum unsubscribeType {
  Chapter,
  Event,
}

export type UnsubscribeToken = {
  type: unsubscribeType;
  id: number;
  userId: number;
  iat: number;
  exp: number;
};

export const generateToken = (
  type: unsubscribeType,
  id: number,
  userId: number,
) => {
  return sign(
    {
      type: type,
      id: id,
      userId: userId,
    },
    getConfig('JWT_SECRET'),
    { expiresIn: '14d' },
  );
};
