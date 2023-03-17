import React from 'react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_CHAPTERS } from '../graphql/queries';
import { DASHBOARD_EVENTS } from '../../Events/graphql/queries';
import { DASHBOARD_VENUES } from '../../Venues/graphql/queries';
import { meQuery } from '../../../auth/graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../../../events/graphql/queries';
import {
  userDownloadQuery,
  userProfileQuery,
} from '../../../profiles/graphql/queries';
import { useUser } from '../../../auth/user';
import { checkInstancePermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { useDeleteChapterMutation } from '../../../../generated/graphql';

export const DeleteChapterButton = ({
  chapterId,
  size,
  width,
}: {
  chapterId: number;
  size?: string;
  width?: string;
}) => {
  const { user } = useUser();
  const router = useRouter();
  const confirmDelete = useConfirmDelete();

  const [deleteChapter] = useDeleteChapterMutation({
    refetchQueries: [
      { query: CHAPTERS },
      { query: DASHBOARD_CHAPTERS },
      { query: DASHBOARD_EVENTS },
      { query: DASHBOARD_VENUES },
      {
        query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
        variables: { offset: 0, limit: 2 },
      },
      {
        query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
        variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
      },
      { query: meQuery },
      { query: userProfileQuery },
      { query: userDownloadQuery },
    ],
  });

  const clickDelete = async () => {
    const ok = await confirmDelete({
      body: 'Are you sure you want to delete this chapter? All information related to chapter will be deleted, including events and venues from this chapter. Chapter deletion cannot be reversed.',
      buttonText: 'Delete Chapter',
    });
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.replace('/dashboard/chapters');
  };

  return (
    <>
      {checkInstancePermission(user, Permission.ChapterDelete) && (
        <Button
          colorScheme="red"
          size={size}
          width={width}
          onClick={clickDelete}
        >
          Delete Chapter
        </Button>
      )}
    </>
  );
};
