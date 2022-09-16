import { Heading, Link, Box, HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterLazyQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Loading } from '../../shared/components/Loading';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const { param: chapterId, isReady } = useParam('id');

  const [getChapter, { loading, error, data }] = useChapterLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapter();
  }, [isReady]);

  const isLoading = loading || !isReady || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

  // TODO: render something nicer if this happens. A 404 page?
  if (!data.chapter) return <div> Chapter not found</div>;

  return (
    <Layout>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Heading as="h5" fontWeight="normal">
            {data.chapter.name}
          </Heading>
          <Box>
            <Link href={`${chapterId}/users`} target="_blank">
              Chapter Users
            </Link>
          </Box>
          <HStack>
            <LinkButton size="sm" href={`${chapterId}/new-event`}>
              Add new event
            </LinkButton>
            <LinkButton
              data-cy="create-venue"
              size="sm"
              href={`${chapterId}/new-venue`}
            >
              Add new venue
            </LinkButton>
          </HStack>
        </ProgressCardContent>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
