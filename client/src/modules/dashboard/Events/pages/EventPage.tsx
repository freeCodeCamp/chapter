import { Button, Box, Heading, Link, Text } from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import {
  useConfirmRsvpMutation,
  useDeleteRsvpMutation,
  useEventQuery,
  MutationConfirmRsvpArgs,
  MutationDeleteRsvpArgs,
} from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import getLocationString from '../../../../helpers/getLocationString';
import { isOnline, isPhysical } from '../../../../helpers/venueType';
import { Layout } from '../../shared/components/Layout';
import Actions from '../components/Actions';
import SponsorCard from '../components/EventSponsorCard';
import { EVENT } from '../graphql/queries';

const args = (id: number) => ({
  refetchQueries: [{ query: EVENT, variables: { id } }],
});

export const EventPage: NextPage = () => {
  const router = useRouter();
  const eventId = getId(router.query) || -1;
  const { loading, error, data } = useEventQuery({
    variables: { id: eventId },
  });

  const [confirmRsvpFn] = useConfirmRsvpMutation(args(eventId));
  const [kickRsvpFn] = useDeleteRsvpMutation(args(eventId));

  const confirm = useConfirm();
  const confirmDelete = useConfirmDelete();

  const confirmRSVP =
    ({ eventId, userId }: MutationConfirmRsvpArgs) =>
    () => {
      return confirm().then(() =>
        confirmRsvpFn({ variables: { eventId, userId } }),
      );
    };

  const kick =
    ({ eventId, userId }: MutationDeleteRsvpArgs) =>
    () => {
      return confirmDelete().then(() =>
        kickRsvpFn({ variables: { eventId, userId } }),
      );
    };

  if (loading || error || !data || !data.event) {
    return (
      <Layout>
        <h1>
          {loading ? 'Loading...' : !error ? "Can't find event :(" : 'Error...'}
        </h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p="2" borderWidth="1px" borderRadius="lg">
        <Heading>{data.event.name}</Heading>

        {data.event.canceled && <Heading color="red.500">Canceled</Heading>}
        <Text>{data.event.description}</Text>
        {data.event.image_url && (
          <Text>
            Event Image Url:{' '}
            <Link href={data.event.image_url} isExternal>
              {data.event.image_url}
            </Link>
          </Text>
        )}
        {data.event.url && (
          <Text>
            Event Url:{' '}
            <Link href={data.event.url} isExternal>
              {data.event.url}
            </Link>
          </Text>
        )}
        <Text>Capacity: {data.event.capacity}</Text>
        {/* <Tags tags={data.event.tags} /> */}

        <Actions
          event={data.event}
          onDelete={() => router.replace('/dashboard/events')}
        />
        {isPhysical(data.event.venue_type) && data.event.venue && (
          <>
            <h2>Venue:</h2>
            <h3>{data.event.venue.name}</h3>
            <h4>{getLocationString(data.event.venue, true)}</h4>
          </>
        )}
        {isOnline(data.event.venue_type) && data.event.streaming_url && (
          <Text>
            Streaming Url:{' '}
            <Link href={data.event.streaming_url} isExternal>
              {data.event.streaming_url}
            </Link>
          </Text>
        )}
      </Box>
      {data.event.sponsors.length ? (
        <SponsorCard sponsors={data.event.sponsors} />
      ) : (
        false
      )}
      <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
        <DataTable
          title={
            'RSVPs: ' +
            (data.event.rsvps
              ? data.event.rsvps.filter((r) => !r.on_waitlist).length
              : '0')
          }
          data={data.event.rsvps.filter((r) => !r.on_waitlist)}
          keys={['user', 'ops'] as const}
          emptyText="No users"
          mapper={{
            user: (r) => r.user.name,
            ops: (rsvp) => (
              <Button
                size="xs"
                colorScheme="red"
                onClick={kick({ eventId, userId: rsvp.user.id })}
              >
                Kick
              </Button>
            ),
          }}
        />

        <DataTable
          title={
            'Waitlist: ' +
            (data.event.rsvps
              ? data.event.rsvps.filter((r) => r.on_waitlist).length
              : 0)
          }
          data={data.event.rsvps.filter((r) => r.on_waitlist)}
          keys={['user', 'ops'] as const}
          emptyText="No users"
          mapper={{
            user: (r) => r.user.name,
            ops: (rsvp) => (
              <Button
                size="xs"
                colorScheme="green"
                onClick={confirmRSVP({
                  eventId,
                  userId: rsvp.user.id,
                })}
              >
                Confirm
              </Button>
            ),
          }}
        />
      </Box>
    </Layout>
  );
};
