import { Heading, Link, Box } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const router = useRouter();
  const id = getId(router.query);

  const { loading, error, data } = useChapterQuery({ variables: { id } });

  if (loading || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error}</div>}
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
            <Link href={`${id}/users`} target="_blank">
              Chapter Users
            </Link>
          </Box>
          <LinkButton size="sm" href={`${id}/new_event`}>
            Add new event
          </LinkButton>
        </ProgressCardContent>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
