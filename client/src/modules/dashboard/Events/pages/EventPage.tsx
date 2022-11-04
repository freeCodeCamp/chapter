import {
  Button,
  Box,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { DataTable } from 'chakra-data-table';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import {
  useConfirmRsvpMutation,
  useDashboardEventQuery,
  useDeleteRsvpMutation,
  MutationConfirmRsvpArgs,
  MutationDeleteRsvpArgs,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import getLocationString from '../../../../util/getLocationString';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import Actions from '../components/Actions';
import SponsorsCard from '../../../../components/SponsorsCard';
import { DASHBOARD_EVENT } from '../graphql/queries';
import { EVENT } from '../../../events/graphql/queries';
import { NextPageWithLayout } from '../../../../pages/_app';
import UserName from 'components/UserName';

const args = (eventId: number) => ({
  refetchQueries: [
    { query: EVENT, variables: { eventId } },
    { query: DASHBOARD_EVENT, variables: { eventId } },
  ],
});

export const EventPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: eventId } = useParam('id');

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId },
  });
  const [confirmRsvp] = useConfirmRsvpMutation(args(eventId));
  const [removeRsvp] = useDeleteRsvpMutation(args(eventId));

  const confirm = useConfirm();
  const confirmDelete = useConfirmDelete();

  const onConfirmRsvp =
    ({ eventId, userId }: MutationConfirmRsvpArgs) =>
    async () => {
      const ok = await confirm();
      if (ok) confirmRsvp({ variables: { eventId, userId } });
    };

  const onRemove =
    ({ eventId, userId }: MutationDeleteRsvpArgs) =>
    async () => {
      const ok = await confirmDelete();
      if (ok) removeRsvp({ variables: { eventId, userId } });
    };

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardEvent)
    return <NextError statusCode={404} title="Event not found" />;

  const userLists = [
    {
      title: 'RSVPs',
      rsvpFilter: 'yes',
      action: [{ title: 'Remove', onClick: onRemove, colorScheme: 'red' }],
    },
    {
      title: 'Waitlist',
      rsvpFilter: 'waitlist',
      action: [
        { title: 'Confirm', onClick: onConfirmRsvp, colorScheme: 'blue' },
      ],
    },
    {
      title: 'Canceled',
      rsvpFilter: 'no',
      action: [{ title: 'Remove', onClick: onRemove, colorScheme: 'red' }],
    },
  ];

  return (
    <>
      <Flex
        p="2"
        borderWidth="1px"
        borderRadius="lg"
        gap={'3'}
        flexDirection="column"
      >
        <Heading as="h1">{data.dashboardEvent.name}</Heading>

        {data.dashboardEvent.canceled && (
          <Text fontWeight={500} fontSize={'md'} color="red.500">
            Canceled
          </Text>
        )}
        <Text fontSize={'md'}>{data.dashboardEvent.description}</Text>
        {data.dashboardEvent.image_url && (
          <Text opacity={'.9'}>
            Event Image Url:{' '}
            <Link
              fontWeight={500}
              href={data.dashboardEvent.image_url}
              isExternal
            >
              {data.dashboardEvent.image_url}
            </Link>
          </Text>
        )}
        {data.dashboardEvent.url && (
          <Text opacity={'.9'}>
            Event Url:{' '}
            <Link fontWeight={500} href={data.dashboardEvent.url} isExternal>
              {data.dashboardEvent.url}
            </Link>
          </Text>
        )}
        <Text opacity={'.9'}>
          Capacity:{' '}
          <Text as={'span'} fontWeight={500}>
            {data.dashboardEvent.capacity}
          </Text>
        </Text>
        {isPhysical(data.dashboardEvent.venue_type) &&
          data.dashboardEvent.venue && (
            <>
              <Text opacity={'.9'}>
                Venue:{' '}
                <Text as={'span'} fontWeight={500}>
                  {data.dashboardEvent.venue.name}
                </Text>
              </Text>
              <Text opacity={'.9'}>
                Hosted at:{' '}
                <Text as={'span'} fontWeight={500}>
                  {getLocationString(data.dashboardEvent.venue, true)}
                </Text>
              </Text>
            </>
          )}
        {isOnline(data.dashboardEvent.venue_type) &&
          data.dashboardEvent.streaming_url && (
            <Text opacity={'.9'}>
              Streaming Url:{' '}
              <Link
                fontWeight={500}
                href={data.dashboardEvent.streaming_url}
                isExternal
              >
                {data.dashboardEvent.streaming_url}
              </Link>
            </Text>
          )}

        <Actions
          event={data.dashboardEvent}
          chapter_id={data.dashboardEvent.chapter.id}
          onDelete={() => router.replace('/dashboard/events')}
        />
      </Flex>

      {data.dashboardEvent.sponsors.length ? (
        <SponsorsCard sponsors={data.dashboardEvent.sponsors} />
      ) : (
        false
      )}

      <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
        {userLists.map(({ title, rsvpFilter, action }) => {
          const users = data.dashboardEvent
            ? data.dashboardEvent.event_users.filter(
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
                    user: ({ user }) => <UserName user={user} />,
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
                  // For a single event, each user can only have one event_user
                  // entry, so we can use the user id as the key.
                  <HStack key={user.id}>
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
                            <UserName user={user} />
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
    </>
  );
};

EventPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
