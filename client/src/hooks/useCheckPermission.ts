import { useAuth } from '../modules/auth/store';
import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';

export const useCheckPermission = (
  permission: InstancePermission | ChapterPermission,
) => {
  const { user } = useAuth();

  return user?.instance_role.instance_role_permissions.find(
    (x) => x.instance_permission.name === permission,
  );
};
