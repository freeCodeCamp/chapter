import { verify } from 'jsonwebtoken';
import { Resolver, Arg, Mutation } from 'type-graphql';

import { getConfig } from '../../config';
import { prisma } from '../../prisma';
import {
  UnsubscribeToken,
  UnsubscribeType,
} from '../../services/UnsubscribeToken';

const unsubscribeFromChapter = async (userId: number, chapterId: number) => {
  const chapter = await prisma.chapters.findUniqueOrThrow({
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
  const whereCondition = {
    user_id_event_id: { event_id: eventId, user_id: userId },
  };
  const eventUser = await prisma.event_users.findUniqueOrThrow({
    where: whereCondition,
    include: { event_reminder: true },
  });
  await prisma.event_users.update({
    data: {
      subscribed: false,
      ...(eventUser.event_reminder && { event_reminder: { delete: true } }),
    },
    where: whereCondition,
  });
};

const typeToUnsubscribe = {
  [UnsubscribeType.Chapter]: unsubscribeFromChapter,
  [UnsubscribeType.Event]: unsubscribeFromEvent,
};

@Resolver()
export class UnsubscribeResolver {
  @Mutation(() => Boolean)
  async unsubscribe(@Arg('token') token: string): Promise<boolean> {
    let data;
    try {
      data = verify(
        token,
        getConfig('UNSUBSCRIBE_JWT_SECRET'),
      ) as UnsubscribeToken;
    } catch (e) {
      throw Error('Invalid token');
    }

    await typeToUnsubscribe[data.type](data.userId, data.id);

    return true;
  }
}
