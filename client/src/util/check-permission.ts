import { checker } from '../../../common/authorization';
import {
  ChapterPermission,
  InstancePermission,
} from '../../../common/permissions';
import { UserContextType } from '../modules/auth/user';

export const checkPermission = (
  user: UserContextType['user'],
  requiredPermission: InstancePermission | ChapterPermission,
  variableValues?: Record<string, number>,
) => {
  if (!user) return false;
  const context = { user, events: [], venues: [] };
  return checker(context, requiredPermission, variableValues || {});
};
