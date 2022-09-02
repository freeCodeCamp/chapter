import { sign } from 'jsonwebtoken';

import { getConfig } from '../config';

export enum SubscribeType {
  Chapter = 'chapter',
  Event = 'event',
}

export type SubscribeToken = {
  type: SubscribeType;
  id: number;
  userId: number;
  iat: number;
};

export const generateToken = (
  type: SubscribeType,
  id: number,
  userId: number,
) => sign({ type, id, userId }, getConfig('SUBSCRIBE_SECRET'));
