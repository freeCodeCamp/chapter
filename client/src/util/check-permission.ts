import { checker } from '../../../common/authorization';
import type {
  ChapterPermission,
  InstancePermission,
} from '../../../common/permissions';
import { UserContextType } from '../modules/auth/user';

export const checkInstancePermission = (
  user: UserContextType['user'],
  requiredPermission: InstancePermission,
) => {
  if (!user) return false;
  const context = { user, events: [], venues: [] };
  return checker(context, requiredPermission, {});
};

export const checkChapterPermission = (
  user: UserContextType['user'],
  requiredPermission: ChapterPermission,
  variableValues: { chapterId?: number; eventId?: number; venueId?: number },
) => {
  if (!user) return false;
  const context = { user, events: [], venues: [] };
  return checker(context, requiredPermission, variableValues);
};
