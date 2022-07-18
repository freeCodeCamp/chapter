import { sign } from 'jsonwebtoken';

import { getConfig } from '../config';

export enum UnsubscribeType {
  Chapter = 'chapter',
  Event = 'event',
}

export type UnsubscribeToken = {
  type: UnsubscribeType;
  id: number;
  userId: number;
  iat: number;
};

export const generateToken = (
  type: UnsubscribeType,
  id: number,
  userId: number,
) => sign({ type, id, userId }, getConfig('UNSUBSCRIBE_SECRET'));
