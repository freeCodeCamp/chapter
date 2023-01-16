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
  return currentUserData?.user_chapters.some(({ chapter_id }) => {
    checkPermission(currentUserData, permission, { chapterId: chapter_id });
    console.log(
      checkPermission(currentUserData, permission, { chapterId: chapter_id }),
    );
  });
};
