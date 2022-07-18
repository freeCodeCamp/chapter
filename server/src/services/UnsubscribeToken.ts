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
};

export const generateToken = (
  type: unsubscribeType,
  id: number,
  userId: number,
) => sign({ type, id, userId }, getConfig('UNSUBSCRIBE_SECRET'));
