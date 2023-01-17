import { Heading, Text } from '@chakra-ui/layout';
import NextError from 'next/error';
import React, { ReactElement } from 'react';
import { Link } from 'chakra-next-link';

import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useVenueQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { Layout } from '../../shared/components/Layout';
import { NextPageWithLayout } from '../../../../pages/_app';

export const VenuePage: NextPageWithLayout = () => {
  const { param: venueId } = useParam('id');

  const { loading, error, data } = useVenueQuery({
    variables: { venueId },
  });

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.venue)
    return <NextError statusCode={404} title="Venue not found" />;

  const chapter = data.venue.chapter;

  return (
    <>
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading as="h1" fontWeight="normal" mb="2">
            {data.venue.name}
          </Heading>

          <Text>{getLocationString(data.venue, true)}</Text>
          <Text>
            <Link fontWeight={500} href={`/dashboard/chapters/${chapter.id}`}>
              {chapter.name}
            </Link>
          </Text>
        </ProgressCardContent>
      </Card>
      <EventList
        title="Organized At The Venue"
        events={data.venue.chapter.events}
      />
    </>
  );
};

VenuePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout dataCy="view-venue-page">{page}</Layout>;
};
