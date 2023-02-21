import { Prisma } from '@prisma/client';
import { ChapterRoles } from '../../../common/roles';

import { prisma } from '../../src/prisma';
import { makeBooleanIterator } from './lib/util';

const setupRoles = async (
  {
    ownerId,
    chapter1AdminId,
    chapter2AdminId,
    bannedAdminId,
    userIds,
  }: {
    ownerId: number;
    chapter1AdminId: number;
    chapter2AdminId: number;
    bannedAdminId: number;
    userIds: number[];
  },
  chapterIds: number[],
): Promise<void> => {
  const chapterRoles = (await prisma.chapter_roles.findMany()) ?? [];

  const administratorRoleId = chapterRoles.find(
    ({ name }) => name === ChapterRoles.administrator,
  )?.id;
  const memberRoleId = chapterRoles.find(
    ({ name }) => name === ChapterRoles.member,
  )?.id;

  if (!administratorRoleId || !memberRoleId)
    throw new Error('Missing chapter roles');
  const usersData: Prisma.chapter_usersCreateManyInput[] = [];
  const subscribeIterator = makeBooleanIterator();

  const chapter1AdminData: Prisma.chapter_usersCreateManyInput = {
    joined_date: new Date(),
    chapter_id: 1,
    user_id: chapter1AdminId,
    chapter_role_id: administratorRoleId,
    subscribed: true,
  };
  usersData.push(chapter1AdminData);

  const chapter2AdminData: Prisma.chapter_usersCreateManyInput = {
    joined_date: new Date(),
    chapter_id: 2,
    user_id: chapter2AdminId,
    chapter_role_id: administratorRoleId,
    subscribed: true,
  };
  usersData.push(chapter2AdminData);

  for (const chapterId of chapterIds) {
    const ownerData: Prisma.chapter_usersCreateManyInput = {
      joined_date: new Date(),
      chapter_id: chapterId,
      user_id: ownerId,
      chapter_role_id: memberRoleId, // This user is an instance owner
      // so this chapter role should not provide additional permissions beyond
      // those provided by the instance owner role. It is possible for them to
      // be a member of a chapter, though, so this grants them the member role
      // for all chapters.
      subscribed: true,
    };

    usersData.push(ownerData);

    const bannedAdminData: Prisma.chapter_usersCreateManyInput = {
      joined_date: new Date(),
      chapter_id: chapterId,
      user_id: bannedAdminId,
      chapter_role_id: administratorRoleId,
      subscribed: false,
    };

    usersData.push(bannedAdminData);

    const [firstUserId] = userIds;
    const memberBanData: Prisma.user_bansCreateManyInput = {
      user_id: firstUserId,
      chapter_id: chapterId,
    };
    const adminBanData: Prisma.user_bansCreateManyInput = {
      user_id: bannedAdminId,
      chapter_id: chapterId,
    };
    await prisma.user_bans.createMany({
      data: [memberBanData, adminBanData],
    });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const userSubscribed = makeBooleanIterator(subscribeIterator.next().value);
    for (const user of userIds) {
      const userData: Prisma.chapter_usersCreateManyInput = {
        joined_date: new Date(),
        chapter_id: chapterId,
        user_id: user,
        chapter_role_id: memberRoleId,
        subscribed: userSubscribed.next().value,
      };

      usersData.push(userData);
    }
  }
  await prisma.chapter_users.createMany({ data: usersData });
};

export default setupRoles;
