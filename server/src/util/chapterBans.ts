import { prisma } from '../prisma';

import { ChapterRoles, InstanceRoles } from '../../../common/roles';
import { User } from '../controllers/Auth/middleware';

export const isBannable = ({
  userId,
  userChapterRole,
  userInstanceRole,
  otherChapterRole,
  otherInstanceRole,
  otherUserId,
}: {
  userId: number;
  userChapterRole: string;
  userInstanceRole: string;
  otherInstanceRole: string;
  otherChapterRole: string;
  otherUserId: number;
}) => {
  if (otherUserId === userId || otherInstanceRole === InstanceRoles.owner)
    return false;
  if (userInstanceRole === InstanceRoles.owner) return true;

  if (otherChapterRole === ChapterRoles.administrator) return false;
  if (userChapterRole === ChapterRoles.administrator) return true;
  return false;
};

export const canBanOther = async ({
  chapterId,
  otherUserId,
  banningUser,
}: {
  chapterId: number;
  otherUserId: number;
  banningUser: User;
}) => {
  const userInstanceRole = banningUser.instance_role.name;
  const userChapterRole =
    banningUser.user_chapters.find(({ chapter_id }) => chapter_id === chapterId)
      ?.chapter_role.name ?? ChapterRoles.member;

  const otherUser = await prisma.chapter_users.findUniqueOrThrow({
    where: {
      user_id_chapter_id: { chapter_id: chapterId, user_id: otherUserId },
    },
    include: {
      chapter_role: true,
      user: { include: { instance_role: true } },
    },
  });

  return isBannable({
    userId: banningUser.id,
    userChapterRole,
    userInstanceRole,
    otherUserId: otherUser.user_id,
    otherChapterRole: otherUser.chapter_role.name,
    otherInstanceRole: otherUser.user.instance_role.name,
  });
};
