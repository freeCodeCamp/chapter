import { Heading, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import NextError from 'next/error';
import React, { useEffect } from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useVenueLazyQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';

export const VenuePage: NextPage = () => {
  const { param: venueId, isReady } = useParam('id');

  const [getVenue, { loading, error, data }] = useVenueLazyQuery({
    variables: { id: venueId },
  });

  useEffect(() => {
    if (isReady) getVenue();
  }, [isReady]);

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;
  if (!data.venue)
    return <NextError statusCode={404} title="Venue not found" />;

  return (
    <Layout dataCy="view-venue-page">
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading as="h2" fontWeight="normal" mb="2">
            {data.venue.name}
          </Heading>

          <Text>{getLocationString(data.venue, true)}</Text>
          <Text>{data.venue.chapter.name}</Text>
        </ProgressCardContent>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
