import { sign } from 'jsonwebtoken';

import { getConfig } from '../config';

export enum unsubscribeType {
  Chapter,
  Event,
}

export type UnsubscribeToken = {
  type: unsubscribeType;
  id: number;
  user_id: number;
  iat: number;
  exp: number;
};

export const generateToken = (
  type: unsubscribeType,
  id: number,
  user_id: number,
) => {
  return sign(
    {
      type: type,
      id: id,
      user_id: user_id,
    },
    getConfig('JWT_SECRET'),
    { expiresIn: '14d' },
  );
};
