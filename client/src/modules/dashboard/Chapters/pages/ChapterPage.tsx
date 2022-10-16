import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';

import { useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useDashboardChapterLazyQuery,
  useDeleteChapterMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { Layout } from '../../shared/components/Layout';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { VENUES } from '../../Venues/graphql/queries';
import { EVENTS } from '../../Events/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../../../events/graphql/queries';
import { NextPageWithLayout } from '../../../../pages/_app';

export const ChapterPage: NextPageWithLayout = () => {
  const { param: chapterId, isReady } = useParam('id');

  const confirmDelete = useConfirmDelete();

  const [deleteChapter] = useDeleteChapterMutation({
    refetchQueries: [
      { query: CHAPTERS },
      { query: EVENTS },
      { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
      {
        query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
        variables: { offset: 0, limit: 5 },
      },
      { query: VENUES },
    ],
  });

  const [getChapter, { loading, error, data }] = useDashboardChapterLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapter();
  }, [isReady]);

  const router = useRouter();

  const clickDelete = async () => {
    const ok = await confirmDelete({
      body: 'Are you sure you want to delete this chapter? chapter deletion cannot be reversed',
      buttonText: 'Delete Chapter',
    });
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.push('/dashboard/chapters');
  };

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;
  if (!data.dashboardChapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Heading
            fontSize={'md'}
            as="h1"
            fontWeight="semibold"
            marginBlock={'2'}
          >
            {data.dashboardChapter.name}
          </Heading>
          <Box>
            <LinkButton href={`${chapterId}/users`} paddingBlock={'2'}>
              Chapter Users
            </LinkButton>
          </Box>
          <HStack mt={'2'}>
            <LinkButton
              colorScheme={'blue'}
              size="sm"
              href={`${chapterId}/new-event`}
            >
              Add new event
            </LinkButton>
            <LinkButton
              colorScheme={'blue'}
              data-cy="create-venue"
              size="sm"
              href={`${chapterId}/new-venue`}
            >
              Add new venue
            </LinkButton>
            <Button colorScheme="red" size={'sm'} onClick={clickDelete}>
              Delete Chapter
            </Button>
          </HStack>
        </ProgressCardContent>
      </Card>
      <EventList
        title="Organized Events"
        events={data.dashboardChapter.events}
      />
    </>
  );
};

ChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
