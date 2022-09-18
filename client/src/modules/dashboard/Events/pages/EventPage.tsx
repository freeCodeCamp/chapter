import {
  Button,
  Box,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import {
  useConfirmRsvpMutation,
  useDeleteRsvpMutation,
  useEventLazyQuery,
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

  const [getEvent, { loading, error, data }] = useEventLazyQuery({
    variables: { eventId },
  });

  useEffect(() => {
    if (isReady) getEvent();
  }, [isReady]);

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
      action: [{ title: 'Kick', onClick: kick, colorScheme: 'red' }],
    },
    {
      title: 'Canceled',
      rsvpFilter: 'no',
      action: [{ title: 'Kick', onClick: kick, colorScheme: 'red' }],
    },
    {
      title: 'Waitlist',
      rsvpFilter: 'waitlist',
      action: [{ title: 'Confirm', onClick: confirmRSVP, colorScheme: 'blue' }],
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
        {userLists.map(({ title, rsvpFilter, action }) => {
          const users = data.event
            ? data.event.event_users.filter(
                ({ rsvp }) => rsvp.name === rsvpFilter,
              )
            : [];
          return (
            <Box key={title.toLowerCase()} data-cy={title.toLowerCase()}>
              <Box display={{ base: 'none', lg: 'block' }}>
                <DataTable
                  title={`${title}: ${users.length}`}
                  data={users}
                  keys={['user', 'role', 'action'] as const}
                  emptyText="No users"
                  mapper={{
                    user: ({ user }) => (
                      <Text data-cy="username">{user.name}</Text>
                    ),
                    action: ({ user }) => (
                      <HStack>
                        {action.map(({ title, onClick, colorScheme }) => (
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
              <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
                {users.map(({ event_role, user, rsvp }, index) => (
                  <HStack key={index}>
                    <DataTable
                      title={'RSVP: ' + rsvp.name.toUpperCase()}
                      data={[users[index]]}
                      keys={['type', 'action'] as const}
                      showHeader={false}
                      emptyText="No users"
                      mapper={{
                        type: () => (
                          <VStack
                            align={'flex-start'}
                            fontSize={['sm', 'md']}
                            fontWeight={700}
                            spacing={'2'}
                            marginBottom={4}
                          >
                            <Text>User</Text>
                            <Text>Role</Text>
                            <Text>Actions</Text>
                          </VStack>
                        ),
                        action: () => (
                          <VStack
                            align={'flex-start'}
                            fontSize={['sm', 'md']}
                            spacing={'2'}
                            marginBottom={4}
                          >
                            <Text data-cy="username">{user.name}</Text>
                            {action.map(({ title, onClick, colorScheme }) => (
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
                            <Text data-cy="role">{event_role.name}</Text>
                          </VStack>
                        ),
                      }}
                    />
                  </HStack>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Layout>
  );
};
