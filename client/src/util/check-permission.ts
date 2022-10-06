import type { AuthContextType } from '../modules/auth/store';
import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';

export const checkPermission = (
  user: AuthContextType['user'],
  permission: InstancePermission | ChapterPermission,
) => {
  const hasPermission = user
    ? user.instance_role.instance_role_permissions.some(
        (x) => x.instance_permission.name === permission,
      )
    : false;

  return hasPermission;
};
