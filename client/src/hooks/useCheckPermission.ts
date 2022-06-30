import { useAuth } from '../modules/auth/store';

export const useCheckPermission = (permission: string) => {
  const { user } = useAuth();

  return user?.instance_role.instance_role_permissions.find(
    (x) => x.instance_permission.name === permission,
  );
};
