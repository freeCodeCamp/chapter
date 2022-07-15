import { Heading, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useVenueQuery } from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import getLocationString from '../../../../util/getLocationString';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const VenuePage: NextPage = () => {
  const router = useRouter();
  const id = getId(router.query) || -1;

  const { loading, error, data } = useVenueQuery({ variables: { id } });

  if (loading || error || !data?.venue) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

  return (
    <Layout data-cy="view-venue-page">
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading as="h2" fontWeight="normal" mb="2">
            {data.venue.name}
          </Heading>

          <Text>{getLocationString(data.venue, true)}</Text>
        </ProgressCardContent>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
