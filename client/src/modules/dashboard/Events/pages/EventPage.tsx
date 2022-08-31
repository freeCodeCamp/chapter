import { Button, Box, Heading, HStack, Link, Text } from '@chakra-ui/react';
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
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { Layout } from '../../shared/components/Layout';
import Actions from '../components/Actions';
import SponsorsCard from '../../../../components/SponsorsCard';
import { EVENT } from '../graphql/queries';

const args = (eventId: number) => ({
  refetchQueries: [{ query: EVENT, variables: { eventId } }],
});

export const EventPage: NextPage = () => {
  const router = useRouter();
  const { param: eventId, isReady } = useParam('id');
  const { loading, error, data } = useEventQuery({
    variables: { eventId },
  });

  const [confirmRsvpFn] = useConfirmRsvpMutation(args(eventId));
  const [kickRsvpFn] = useDeleteRsvpMutation(args(eventId));

  const confirm = useConfirm();
  const confirmDelete = useConfirmDelete();

  const confirmRSVP =
    ({ eventId, userId }: MutationConfirmRsvpArgs) =>
    async () => {
      const ok = await confirm();
      if (ok) confirmRsvpFn({ variables: { eventId, userId } });
    };

  const kick =
    ({ eventId, userId }: MutationDeleteRsvpArgs) =>
    async () => {
      const ok = await confirmDelete();
      if (ok) kickRsvpFn({ variables: { eventId, userId } });
    };

  if (loading || !isReady || error || !data || !data.event) {
    return (
      <Layout>
        <h1>
          {loading || !isReady
            ? 'Loading...'
            : !error
            ? "Can't find event :("
            : 'Error...'}
        </h1>
      </Layout>
    );
  }

  const userLists = [
    {
      title: 'RSVPs',
      rsvpFilter: 'yes',
      ops: [{ title: 'Kick', onClick: kick, colorScheme: 'red' }],
    },
    {
      title: 'Canceled',
      rsvpFilter: 'no',
      ops: [{ title: 'Kick', onClick: kick, colorScheme: 'red' }],
    },
    {
      title: 'Waitlist',
      rsvpFilter: 'waitlist',
      ops: [{ title: 'Confirm', onClick: confirmRSVP, colorScheme: 'green' }],
    },
  ];

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
        <SponsorsCard sponsors={data.event.sponsors} />
      ) : (
        false
      )}
      <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
        {userLists.map(({ title, rsvpFilter, ops }) => {
          const users = data.event
            ? data.event.event_users.filter(
                ({ rsvp }) => rsvp.name === rsvpFilter,
              )
            : [];
          return (
            <Box key={title.toLowerCase()} data-cy={title.toLowerCase()}>
              <DataTable
                title={`${title}: ${users.length}`}
                data={users}
                keys={['user', 'role', 'ops'] as const}
                emptyText="No users"
                mapper={{
                  user: ({ user }) => (
                    <Text data-cy="username">{user.name}</Text>
                  ),
                  ops: ({ user }) => (
                    <HStack>
                      {ops.map(({ title, onClick, colorScheme }) => (
                        <Button
                          key={title.toLowerCase()}
                          data-cy={title.toLowerCase()}
                          size="xs"
                          colorScheme={colorScheme}
                          onClick={onClick({ eventId, userId: user.id })}
                        >
                          {title}
                        </Button>
                      ))}
                    </HStack>
                  ),
                  role: ({ event_role }) => (
                    <Text data-cy="role">{event_role.name}</Text>
                  ),
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Layout>
  );
};
