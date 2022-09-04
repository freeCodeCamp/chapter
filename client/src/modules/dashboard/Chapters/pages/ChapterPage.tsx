import { Heading, Link, Box, HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('id');

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  if (loading || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && process.env.NODE_ENV === 'production' ? (
          <div>
            <h1>Error...</h1>
            <p>
              We are currently facing an issue or our developers didn&apost get
              enough coffee, we are trying our best to fix this issue and not
              trying to finish our coffee
            </p>
            <h2>
              if the error is persisting please contact{' '}
              <a href="">freecodecamp support</a>
            </h2>
          </div>
        ) : error && process.env.NODE_ENV !== 'production' ? (
          <div className={styles.error}>{error.message}</div>
        ) : null}
      </Layout>
    );
  }

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
