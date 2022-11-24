import { checker } from '../../../common/authorization';
import {
  ChapterPermission,
  InstancePermission,
} from '../../../common/permissions';
import { AuthContextType } from 'modules/auth/store';

export const checkPermission = (
  user: AuthContextType['user'],
  requiredPermission: InstancePermission | ChapterPermission,
  variableValues?: Record<string, number>,
) => {
  if (!user) return false;
  const context = { user, events: [], venues: [] };
  return checker(context, requiredPermission, variableValues || {});
};
