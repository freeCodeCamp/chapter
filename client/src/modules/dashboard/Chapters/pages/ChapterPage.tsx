import { Heading, Link, Box, HStack, Text } from '@chakra-ui/layout';
import { useConfirmDelete } from 'chakra-confirm';

import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useChapterQuery,
  useDeleteChapterMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../../../../modules/events/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../../modules/home/graphql/queries';

export const ChapterPage: NextPage = () => {
  const { param: chapterId, isReady } = useParam('id');

  const confirmDelete = useConfirmDelete();

  const [deleteChapter] = useDeleteChapterMutation({
    refetchQueries: [
      { query: CHAPTERS },
      { query: DATA_PAGINATED_EVENTS_TOTAL_QUERY, variables: { chapterId } },
      { query: HOME_PAGE_QUERY, variables: { chapterId } },
    ],
  });

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  const router = useRouter();

  const clickDelete = async () => {
    const ok = await confirmDelete({ doubleConfirm: true });
    if (!ok) return;
    deleteChapter({ variables: { chapterId } });
    router.push('/dashboard/chapters');
  };

  if (loading || !isReady || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading || !isReady ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

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
      <Text fontWeight={400} margin={2}>
        PlaceHolder for Events...
      </Text>
    </Layout>
  );
};
