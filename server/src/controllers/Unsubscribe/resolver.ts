import { verify } from 'jsonwebtoken';
import { Resolver, Arg, Mutation } from 'type-graphql';

import { getConfig } from '../../config';
import { prisma } from '../../prisma';
import {
  UnsubscribeToken,
  unsubscribeType,
} from '../../services/UnsubscribeToken';

const unsubscribeFromChapter = async (userId: number, chapterId: number) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: chapterId },
    include: { events: true },
  });
  await prisma.chapter_users.update({
    data: { subscribed: false },
    where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
  });
  const onlyUserEventsFromChapter = {
    AND: [
      { user_id: userId },
      { event_id: { in: chapter.events.map(({ id }) => id) } },
    ],
  };

  await prisma.event_users.updateMany({
    data: { subscribed: false },
    where: onlyUserEventsFromChapter,
  });
  await prisma.event_reminders.deleteMany({
    where: onlyUserEventsFromChapter,
  });
};

const unsubscribeFromEvent = async (userId: number, eventId: number) => {
  await prisma.event_users.update({
    data: { subscribed: false },
    where: { user_id_event_id: { event_id: eventId, user_id: userId } },
  });
  await prisma.event_reminders.delete({
    where: { user_id_event_id: { user_id: userId, event_id: eventId } },
  });
};

const typeToUnsubscribe = {
  [unsubscribeType.Chapter]: unsubscribeFromChapter,
  [unsubscribeType.Event]: unsubscribeFromEvent,
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

    await typeToUnsubscribe[data.type](data.userId, data.id);

    return true;
  }
}
