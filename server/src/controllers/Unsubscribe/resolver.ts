// import { Prisma } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { Resolver, Arg, Mutation } from 'type-graphql';

import { getConfig } from '../../config';
import { prisma } from '../../prisma';
import {
  UnsubscribeToken,
  unsubscribeType,
} from '../../services/UnsubscribeToken';

const unsubscribeChapter = async (userId: number, chapterId: number) => {
  await prisma.chapter_users.update({
    data: { subscribed: false },
    where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
  });
};

const unsubscribeEvent = async (userId: number, eventId: number) => {
  await prisma.event_users.update({
    data: { subscribed: false },
    where: { user_id_event_id: { event_id: eventId, user_id: userId } },
  });
};

const typeToUnsubscribe = {
  [unsubscribeType.Chapter]: unsubscribeChapter,
  [unsubscribeType.Event]: unsubscribeEvent,
};

@Resolver()
export class UnsubscribeResolver {
  @Mutation(() => Boolean)
  async unsubscribe(@Arg('token') token: string): Promise<boolean> {
    let data;
    try {
      data = verify(token, getConfig('JWT_SECRET')) as UnsubscribeToken;
    } catch (e) {
      throw Error('Invalid token');
    }

    await typeToUnsubscribe[data.type](data.user_id, data.id);

    return true;
  }
}
