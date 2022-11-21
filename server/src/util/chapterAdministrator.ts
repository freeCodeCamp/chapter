import { Prisma } from '@prisma/client';

import { ChapterRoles, InstanceRoles } from '../../../common/roles';

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
  // The client should not request this change, but if it does it's ignored.
  if (oldRole === InstanceRoles.owner && newRole === InstanceRoles.owner)
    return oldRole;

  // The client should not request this change, but if it does it's ignored.
  if (
    (oldRole === InstanceRoles.chapter_administrator &&
      newRole === InstanceRoles.member) ||
    (oldRole === InstanceRoles.member &&
      newRole === InstanceRoles.chapter_administrator)
  )
    return oldRole;

  // since the former owner may still be an administator, we check if they will
  // need the chapter_administrator role
  if (oldRole === InstanceRoles.owner) {
    const isAdmin = userChapters.some(
      (userChapter) =>
        userChapter.chapter_role.name === ChapterRoles.administrator,
    );

    if (isAdmin) return InstanceRoles.chapter_administrator;
  }
  return newRole;
};
