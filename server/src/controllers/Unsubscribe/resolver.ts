// import { Prisma } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { Resolver, Arg, Mutation } from 'type-graphql';

import { getConfig } from '../../config';
import {
  UnsubscribeToken,
  unsubscribeType,
} from '../../services/UnsubscribeToken';

const unsubscribeChapter = async (user_id: number, chapter_id: number) => {
  return true;
};

const unsubscribeEvent = async (user_id: number, event_id: number) => {
  return true;
};

const unsubscribeInstance = async (user_id: number, instance: number) => {
  return true;
};

const typeToUnsubscribe = {
  [unsubscribeType.Chapter]: unsubscribeChapter,
  [unsubscribeType.Event]: unsubscribeEvent,
  [unsubscribeType.Instance]: unsubscribeInstance,
};

@Resolver()
export class UnsubscribeResolver {
  @Mutation(() => Boolean)
  async unsubscribe(@Arg('token') token: string): Promise<boolean> {
    let data;
    try {
      data = verify(token, getConfig('JWT_SECRET')) as UnsubscribeToken;
    } catch (e) {
      return false;
    }

    await typeToUnsubscribe[data.type](data.user_id, data.id);

    return true;
  }
}
