import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Box, Heading, Text } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';

import { Layout } from '../../shared/components/Layout';
import {
  useConfirmRsvpMutation,
  useDeleteRsvpMutation,
  useEventQuery,
} from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import { EVENT } from '../graphql/queries';
import getLocationString from '../../../../helpers/getLocationString';
import Actions from '../components/Actions';

const args = (id: number) => ({
  refetchQueries: [{ query: EVENT, variables: { id } }],
});

export const EventPage: NextPage = () => {
  const router = useRouter();
  const id = getId(router.query) || -1;
  const { loading, error, data } = useEventQuery({ variables: { id } });

  const [confirmRsvpFn] = useConfirmRsvpMutation(args(id));
  const [kickRsvpFn] = useDeleteRsvpMutation(args(id));

  const confirm = useConfirm();
  const confirmDelete = useConfirmDelete();

  const confirmRSVP = (id: number) => () => {
    return confirm().then(() => confirmRsvpFn({ variables: { id } }));
  };

  const kick = (id: number) => () => {
    return confirmDelete().then(() => kickRsvpFn({ variables: { id } }));
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
        {data.event.url && (
          <Text>
            Event Url: <a href={data.event.url}>{data.event.url}</a>
          </Text>
        )}
        {data.event.video_url && (
          <Text>
            Video Url: <a href={data.event.video_url}>{data.event.video_url}</a>
          </Text>
        )}
        <Text>Capacity: {data.event.capacity}</Text>
        {/* <Tags tags={data.event.tags} /> */}

        <Actions
          event={data.event}
          onDelete={() => router.replace('/dashboard/events')}
        />
        {data.event.venue ? (
          <>
            <h2>Venue:</h2>
            <h1 style={{ padding: 0 }}>{data.event.venue.name}</h1>
            <h4>{getLocationString(data.event.venue, true)}</h4>
          </>
        ) : (
          <h2>Venue: Online</h2>
        )}
      </Box>

      <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
        <DataTable
          title="RSVPs:"
          data={data.event.rsvps.filter((r) => !r.on_waitlist)}
          keys={['id', 'user', 'ops'] as const}
          emptyText="No users"
          mapper={{
            id: (_, i) => <Text>{i + 1}</Text>,
            user: (r) => r.user.name,
            ops: (rsvp) => (
              <Button size="xs" colorScheme="red" onClick={kick(rsvp.id)}>
                Kick
              </Button>
            ),
          }}
        />

        <DataTable
          title="Waitlist:"
          data={data.event.rsvps.filter((r) => r.on_waitlist)}
          keys={['id', 'user', 'ops'] as const}
          emptyText="No users"
          mapper={{
            id: (_, i) => <Text>{i + 1}</Text>,
            user: (r) => r.user.name,
            ops: (rsvp) => (
              <Button
                size="xs"
                colorScheme="green"
                onClick={confirmRSVP(rsvp.id)}
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
