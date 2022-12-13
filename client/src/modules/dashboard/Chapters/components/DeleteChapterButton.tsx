import React from 'react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_CHAPTERS } from '../graphql/queries';
import { DASHBOARD_EVENTS } from '../../Events/graphql/queries';
import { DASHBOARD_VENUES } from '../../Venues/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../../../events/graphql/queries';
import { useAuth } from '../../../../modules/auth/store';
import { checkPermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { useDeleteChapterMutation } from '../../../../generated/graphql';

export const DeleteChapterButton = ({ chapterId }: { chapterId: number }) => {
  const { user } = useAuth();
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
        variables: { offset: 0, limit: 5 },
      },
      { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
    ],
  });

  const clickDelete = async () => {
    const ok = await confirmDelete({
      body: 'Are you sure you want to delete this chapter? All information related to chapter will be deleted, including events and venues from this chapter. Chapter deletion cannot be reversed.',
      buttonText: 'Delete Chapter',
    });
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.push('/dashboard/chapters');
  };

  return (
    <>
      {checkPermission(user, Permission.ChapterDelete, { chapterId }) && (
        <Button colorScheme="red" size="sm" onClick={clickDelete}>
          Delete Chapter
        </Button>
      )}
    </>
  );
};
