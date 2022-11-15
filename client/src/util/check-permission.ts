import type { AuthContextType } from '../modules/auth/store';
import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';

export const checkPermission = (
  user: AuthContextType['user'],
  permission: InstancePermission | ChapterPermission,
  options?: { chapterId: number },
) => {
  if (!user) return false;
  if (
    user.instance_role.instance_role_permissions.some(
      (x) => x.instance_permission.name === permission,
    )
  )
    return true;
  if (!options) return false;

  if (user.user_bans.some(({ chapter_id }) => chapter_id === options.chapterId))
    return false;

  if (
    user.user_chapters
      .find(({ chapter_id }) => chapter_id === options.chapterId)
      ?.chapter_role.chapter_role_permissions.some(
        ({ chapter_permission: { name } }) => name === permission,
      )
  )
    return true;

  return false;
};
