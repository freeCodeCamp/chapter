import { ChapterPermission } from '../../../common/permissions';
import { checkPermission } from './check-permission';
import { MeQuery } from 'generated/graphql';

export const checkHasChapterPermission = (
  currentUserData: MeQuery['me'],
  permission: ChapterPermission,
) => {
  return currentUserData?.admined_chapters.some(({ id }) =>
    checkPermission(currentUserData, permission, { chapterId: id }),
  );
};
