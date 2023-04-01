import { Button, Heading, HStack, Text } from '@chakra-ui/react';
import NextError from 'next/error';
import React, { ReactElement } from 'react';
import { Link, LinkButton } from 'chakra-next-link';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';

import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { TagsBox } from '../../../../components/TagsBox';
import {
  useVenueQuery,
  useDeleteVenueMutation,
  VenueQuery,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { NextPageWithLayout } from '../../../../pages/_app';
import { DASHBOARD_VENUES } from '../graphql/queries';
import { DASHBOARD_CHAPTER } from '../../../dashboard/Chapters/graphql/queries';
import {
  DASHBOARD_EVENT,
  DASHBOARD_EVENTS,
} from '../../../dashboard/Events/graphql/queries';

const eventRefetches = (data?: VenueQuery) => {
  return (
    data?.venue?.chapter.events.map(({ id: eventId }) => ({
      query: DASHBOARD_EVENT,
      variables: { eventId },
    })) ?? []
  );
};

export const VenuePage: NextPageWithLayout = () => {
  const { param: venueId } = useParam('id');
  const confirmDelete = useConfirmDelete();
  const [deleteVenue] = useDeleteVenueMutation();
  const router = useRouter();

  const { loading, error, data } = useVenueQuery({
    variables: { venueId },
  });

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.venue)
    return <NextError statusCode={404} title="Venue not found" />;

  const chapterId = data.venue.chapter.id;

  const clickDelete = async () => {
    const ok = await confirmDelete({
      body: 'Are you sure you want to delete this venue? All information related to venue will be deleted. Venue deletion cannot be reversed.',
      buttonText: 'Delete Venue',
    });
    if (!ok) return;
    deleteVenue({
      variables: { venueId, chapterId },
      refetchQueries: [
        { query: DASHBOARD_CHAPTER, variables: { chapterId } },
        { query: DASHBOARD_EVENTS },
        { query: DASHBOARD_VENUES },
        ...eventRefetches(data),
      ],
    });
    router.replace('/dashboard/venues');
  };

  const chapter = data.venue.chapter;

  return (
    <>
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading as="h1" fontWeight="normal" mb="2">
            {data.venue.name}
          </Heading>
          {!!data.venue.venue_tags.length && (
            <TagsBox tags={data.venue.venue_tags} />
          )}

          <Text>{getLocationString(data.venue, true)}</Text>
          <Link fontWeight={500} href={`/dashboard/chapters/${chapter.id}`}>
            {chapter.name}
          </Link>
        </ProgressCardContent>
        <HStack spacing="3">
          <LinkButton
            size={['sm', 'md']}
            colorScheme="blue"
            href={`/dashboard/chapters/${data.venue.chapter.id}/venues/${data.venue.id}/edit`}
          >
            Edit
          </LinkButton>
          <Button size={['sm', 'md']} colorScheme="red" onClick={clickDelete}>
            Delete Venue
          </Button>
        </HStack>
      </Card>
      <EventList
        title="Organized At The Venue"
        events={data.venue.chapter.events}
      />
    </>
  );
};

VenuePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout dataCy="view-venue-page">{page}</DashboardLayout>;
};
