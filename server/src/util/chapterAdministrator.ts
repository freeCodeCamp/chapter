import { Prisma } from '@prisma/client';

import { ChapterRoles } from '../..//prisma/generator/factories/chapterRoles.factory';
import { InstanceRoles } from '../../prisma/generator/factories/instanceRoles.factory';

type UserChapters = Prisma.chapter_usersGetPayload<{
  include: {
    chapter_role: true;
  };
}>;

interface ChangeInstanceRoleData {
  changedChapterId: number;
  newChapterRole: string;
  oldInstanceRole: string;
  userChapters: UserChapters[];
}

export const getInstanceRoleName = ({
  changedChapterId,
  newChapterRole,
  oldInstanceRole,
  userChapters,
}: ChangeInstanceRoleData) => {
  if (oldInstanceRole === InstanceRoles.owner) return oldInstanceRole;

  if (
    newChapterRole === ChapterRoles.administrator &&
    oldInstanceRole !== InstanceRoles.chapter_administrator
  ) {
    return InstanceRoles.chapter_administrator;
  }

  if (
    newChapterRole === ChapterRoles.member &&
    oldInstanceRole === InstanceRoles.chapter_administrator
  ) {
    const isStillAdmin = userChapters.some(
      (chapterUser) =>
        chapterUser.chapter_id !== changedChapterId &&
        chapterUser.chapter_role.name === ChapterRoles.administrator,
    );

    if (!isStillAdmin) return InstanceRoles.member;
  }
  return oldInstanceRole;
};

interface ChangeRoleNameData {
  oldRole: string;
  newRole: string;
  userChapters: UserChapters[];
}

export const getRoleName = ({
  oldRole,
  newRole,
  userChapters,
}: ChangeRoleNameData) => {
  if (oldRole === InstanceRoles.owner && newRole === InstanceRoles.owner)
    return oldRole;

  if (
    oldRole === InstanceRoles.chapter_administrator &&
    newRole === InstanceRoles.member
  )
    return InstanceRoles.chapter_administrator;

  if (oldRole === InstanceRoles.owner) {
    const isAdmin = userChapters.some(
      (userChapter) =>
        userChapter.chapter_role.name === ChapterRoles.administrator,
    );

    if (isAdmin) return InstanceRoles.chapter_administrator;
  }
  return newRole;
};
