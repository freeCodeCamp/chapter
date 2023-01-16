import {
  InstancePermission,
  ChapterPermission,
} from '../../../common/permissions';
import { checkPermission } from './check-permission';
import { MeQuery } from 'generated/graphql';

export const checkIfhasPermission = (
  currentUserData: MeQuery['me'],
  permission: InstancePermission | ChapterPermission,
) => {
  return currentUserData?.admined_chapters.some(({ id }) => {
    checkPermission(currentUserData, permission, { chapterId: id });
  });
};
