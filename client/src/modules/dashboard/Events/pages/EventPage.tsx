import {
  Button,
  Box,
  Heading,
  HStack,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  useConfirmRsvpMutation,
  useDeleteRsvpMutation,
  useEventQuery,
  useEventRolesQuery,
  useChangeEventUserRoleMutation,
  MutationConfirmRsvpArgs,
  MutationDeleteRsvpArgs,
} from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import getLocationString from '../../../../util/getLocationString';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { Layout } from '../../shared/components/Layout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../shared/components/RoleChangeModal';
import Actions from '../components/Actions';
import SponsorsCard from '../../../../components/SponsorsCard';
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

  const { data: eventRoles } = useEventRolesQuery();
  const modalProps = useDisclosure();
  const [eventUser, setEventUser] = useState<RoleChangeModalData>();
  const [changeRoleMutation] = useChangeEventUserRoleMutation(args(eventId));

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

  const changeRole = (data: RoleChangeModalData) => {
    setEventUser(data);
    modalProps.onOpen();
  };
  const onModalSubmit = async (data: { newRoleId: number; userId: number }) => {
    changeRoleMutation({
      variables: {
        eventId: eventId,
        roleId: data.newRoleId,
        userId: data.userId,
      },
    });
    modalProps.onClose();
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
      {eventRoles && eventUser && (
        <RoleChangeModal
          modalProps={modalProps}
          data={eventUser}
          roles={eventRoles.eventRoles.map(({ id, name }) => ({
            id,
            name,
          }))}
          title="Change event role"
          onSubmit={onModalSubmit}
        />
      )}
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
                  ops: ({ user, event_role }) => (
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
                      <Button
                        data-cy="changeRole"
                        colorScheme="blue"
                        size="xs"
                        onClick={() =>
                          changeRole({
                            roleId: event_role.id,
                            userId: user.id,
                            userName: user.name,
                          })
                        }
                      >
                        Change role
                      </Button>
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
