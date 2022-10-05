import { useEffect, useState } from 'react';

import { useAuth } from '../modules/auth/store';
import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';

export const useCheckPermission = (
  permission: InstancePermission | ChapterPermission,
) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setHasPermission(
        user.instance_role.instance_role_permissions.some(
          (x) => x.instance_permission.name === permission,
        ),
      );
      setLoading(false);
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  return [loading, hasPermission];
};
