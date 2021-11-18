import { Prisma } from '@prisma/client';

import { makeBooleanIterator } from './lib/util';
import { prisma } from 'src/prisma';

const setupRoles = async (
  adminId: number,
  userIds: number[],
  chapterIds: number[],
): Promise<void> => {
  const data: Prisma.user_chapter_rolesCreateManyInput[] = [];
  const chapterIterator = makeBooleanIterator();
  for (const chapterId of chapterIds) {
    const chapterUserData = {
      chapter_id: chapterId,
      user_id: adminId,
      role_name: 'organizer',
      interested: true,
    };

    data.push(chapterUserData);

    const [banned, ...others] = userIds;
    const banData: Prisma.user_bansCreateInput = {
      users: { connect: { id: banned } },
      chapters: { connect: { id: chapterId } },
    };
    await prisma.user_bans.create({ data: banData });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const interestedIterator = makeBooleanIterator(
      chapterIterator.next().value,
    );
    for (const user of others) {
      const chapterUserData = {
        chapter_id: chapterId,
        user_id: user,
        role_name: 'member',
        interested: interestedIterator.next().value,
      };

      data.push(chapterUserData);
    }
  }
  await prisma.user_chapter_roles.createMany({ data });
};

export default setupRoles;
