import { Prisma } from '@prisma/client';

import { prisma } from '../../src/prisma';
import { makeBooleanIterator } from './lib/util';

const setupRoles = async (
  adminId: number,
  userIds: number[],
  chapterIds: number[],
  chapterRoles: Record<string, { name: string; id: number }>,
): Promise<void> => {
  const usersData: Prisma.chapter_usersCreateManyInput[] = [];
  const subscribeIterator = makeBooleanIterator();
  for (const chapterId of chapterIds) {
    const userData: Prisma.chapter_usersCreateManyInput = {
      joined_date: new Date(),
      chapter_id: chapterId,
      user_id: adminId,
      chapter_role_id: chapterRoles.organizer.id,
      subscribed: true,
    };

    usersData.push(userData);

    const [banned, ...others] = userIds;
    const banData: Prisma.user_bansCreateInput = {
      users: { connect: { id: banned } },
      chapters: { connect: { id: chapterId } },
    };
    await prisma.user_bans.create({ data: banData });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const userSubscribed = makeBooleanIterator(subscribeIterator.next().value);
    for (const user of others) {
      const userData: Prisma.chapter_usersCreateManyInput = {
        joined_date: new Date(),
        chapter_id: chapterId,
        user_id: user,
        chapter_role_id: chapterRoles.member.id,
        subscribed: userSubscribed.next().value,
      };

      usersData.push(userData);
    }
  }
  await prisma.chapter_users.createMany({ data: usersData });
};

export default setupRoles;
