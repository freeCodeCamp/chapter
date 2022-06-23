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
      chapter_role_id: chapterRoles.member.id, // This user is an instance owner
      // so this chapter role should not provide additional permissions beyond
      // those provided by the instance owner role. It is possible for them to
      // be a member of a chapater, though, so this grants them the member role
      // for all chapters.
      subscribed: true,
    };

    usersData.push(userData);

    const [banned] = userIds;
    const banData: Prisma.user_bansCreateInput = {
      user: { connect: { id: banned } },
      chapter: { connect: { id: chapterId } },
    };
    await prisma.user_bans.create({ data: banData });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const userSubscribed = makeBooleanIterator(subscribeIterator.next().value);
    for (const user of userIds) {
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
