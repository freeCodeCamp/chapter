import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';
import { AuthContextType } from '../modules/auth/store';

type User = NonNullable<AuthContextType['user']>;

function isAllowedByChapterRole(
  user: User,
  requiredPermission: string,
  options: { chapterId: number },
) {
  const chapterRole = user.user_chapters.find(
    ({ chapter_id }) => chapter_id === options.chapterId,
  )?.chapter_role;
  return chapterRole
    ? chapterRole.chapter_role_permissions.some(
        ({ chapter_permission: { name } }) => name === requiredPermission,
      )
    : false;
}

function isAllowedByInstanceRole(user: User, requiredPermission: string) {
  return user.instance_role.instance_role_permissions.some(
    ({ instance_permission: { name } }) => name === requiredPermission,
  );
}

function isBannedFromChapter(user: User, options: { chapterId: number }) {
  return user.user_bans.some(
    ({ chapter_id }) => chapter_id === options.chapterId,
  );
}

export const checkPermission = (
  user: AuthContextType['user'],
  requiredPermission: InstancePermission | ChapterPermission,
  options?: { chapterId: number },
) => {
  if (!user) return false;
  if (isAllowedByInstanceRole(user, requiredPermission)) return true;
  if (!options) return false;
  if (isBannedFromChapter(user, options)) return false;
  if (isAllowedByChapterRole(user, requiredPermission, options)) return true;

  return false;
};
