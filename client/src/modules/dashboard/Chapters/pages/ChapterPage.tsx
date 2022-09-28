import { Box, Button, Heading, HStack, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useChapterLazyQuery,
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

export const ChapterPage: NextPage = () => {
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

  const [getChapter, { loading, error, data }] = useChapterLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapter();
  }, [isReady]);

  const router = useRouter();

  const clickDelete = async () => {
    const ok = await confirmDelete({ doubleConfirm: true });
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.push('/dashboard/chapters');
  };

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;
  if (!data.chapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <Layout>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Heading
            fontSize={'md'}
            as="h1"
            fontWeight="semibold"
            marginBlock={'2'}
          >
            {data.chapter.name}
          </Heading>
          <Box>
            <Link
              href={`${chapterId}/users`}
              target="_blank"
              paddingBlock={'2'}
            >
              Chapter Users
            </Link>
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
      <EventList title="Organized Events" events={data.chapter.events} />
    </Layout>
  );
};
