import { Heading, VStack, Text, Flex, HStack, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement } from 'react';

import { formatDate } from '../../../../util/date';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { useAuth } from '../../../auth/store';
import { useEventsQuery, EventsQueryVariables } from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';
import { EventStatus, getEventStatus } from '../../../../util/eventStatus';
import { isPast } from 'date-fns';

export const EventsPage: NextPageWithLayout = () => {
  const { error, loading, data } = useEventsQuery();
  
  const { user } = useAuth();
  
  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  
  const hasEnded = (event: EventsQueryVariables)=> isPast(new Date(event.ends_at));
  const hasStarted = (event: EventsQueryVariables)=> isPast(new Date(event.start_at));
  const canceled = (event: EventsQueryVariables)=> event.canceled
  const eventStatus =()=> getEventStatus({
    canceled,
    hasStarted,
    hasEnded,
  });
  const statusToStyle = {
    [EventStatus.canceled]: { 'data-cy': 'event-canceled', color: 'red.500' },
    [EventStatus.running]: {
      color: 'gray.00',
      backgroundColor: 'gray.45',
      paddingInline: '.3em',
      borderRadius: 'sm',
    },
    [EventStatus.ended]: { color: 'gray.45', fontWeight: '400' },
    [EventStatus.upcoming]: {},
  };
  return (
    <VStack data-cy="events-dashboard">
      <Flex w="full" justify="space-between">
        <Heading id="page-heading">Events</Heading>
        {!!user?.admined_chapters.length && (
          <LinkButton
            data-cy="new-event"
            href="/dashboard/events/new"
            colorScheme={'blue'}
          >
            Add new
          </LinkButton>
        )}
      </Flex>
      <Box>
        <HStack display={{ base: 'none', lg: 'block' }} marginBlock={'2em'}>
          <DataTable
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            data={data.events}
            keys={
              [
                'status',
                'name',
                'invite only',
                'venue',
                'capacity',
                'streaming_url',
                'date',
                'action',
              ] as const
            }
            mapper={{
              status: (event) =>
                  <Text
                    data-cy="event-canceled"
                    color="red.500"
                    fontSize={['md', 'lg']}
                    fontWeight={'semibold'}
                  >
                    {eventStatus(event)}
                  </Text>
              ,
              name: (event) => (
                <VStack align="flex-start">
                  <LinkButton
                    colorScheme={event.canceled ? 'red' : undefined}
                    href={`/dashboard/events/${event.id}`}
                  >
                    {event.name}
                  </LinkButton>
                </VStack>
              ),
              'invite only': (event) => (event.invite_only ? 'Yes' : 'No'),
              venue: (event) =>
                isPhysical(event.venue_type)
                  ? event.venue?.name || ''
                  : 'Online only',
              capacity: true,
              streaming_url: (event) =>
                isOnline(event.venue_type)
                  ? event.streaming_url
                  : 'In-person only',
              date: (event) => formatDate(event.start_at),
              action: (event) => (
                <LinkButton
                  colorScheme="blue"
                  size="sm"
                  href={`/dashboard/events/${event.id}/edit`}
                >
                  Edit
                </LinkButton>
              ),
            }}
          />
        </HStack>
        <HStack display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
          {data.events.map(
            (
              {
                canceled,
                name,
                id,
                start_at,
                invite_only,
                venue,
                venue_type,
                streaming_url,
                capacity,
              },
              index,
            ) => (
              <DataTable
                key={id}
                tableProps={{
                  table: { 'aria-labelledby': 'page-heading' },
                }}
                data={[data.events[index]]}
                keys={['type', 'action'] as const}
                showHeader={false}
                mapper={{
                  type: () => (
                    <VStack
                      fontWeight={'700'}
                      spacing={3}
                      align={'flex-start'}
                      fontSize={['sm', 'md']}
                      minW={'7em'}
                      marginBlock={'1.5em'}
                    >
                      {/* todo fix spacing between elements */}
                      <Text>Status</Text>
                      <Text>Name</Text>
                      <Text>Invite only</Text>
                      <Text>Venue</Text>
                      <Text>Capacity</Text>
                      <Text>Streaming url</Text>
                      <Text>Date</Text>
                      <Text>Actions</Text>
                    </VStack>
                  ),
                  action: () => (
                    <VStack align={'flex-start'} spacing={2} width="10em">
                      <HStack>
                        {canceled ? (
                          <Text
                            color="red.500"
                            fontSize={['md', 'lg']}
                            fontWeight={'semibold'}
                          >
                            Canceled
                          </Text>
                        ) : new Date(start_at) < new Date() ? (
                          <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                            Passed
                          </Text>
                        ) : (
                          <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                            Upcoming
                          </Text>
                        )}
                      </HStack>
                      <VStack align="flex-start">
                        <LinkButton
                          fontSize={'sm'}
                          height={'2em'}
                          size={'sm'}
                          colorScheme={canceled ? 'red' : undefined}
                          href={`/dashboard/events/${id}`}
                        >
                          {name}
                        </LinkButton>
                      </VStack>
                      <Text>{invite_only ? 'Yes' : 'No'}</Text>
                      <Text>
                        {isPhysical(venue_type)
                          ? venue?.name || ''
                          : 'Online only'}
                      </Text>
                      <Text>{capacity}</Text>
                      <Text>
                        {isOnline(venue_type)
                          ? streaming_url
                          : 'In-person only'}
                      </Text>
                      <Text>{formatDate(start_at)}</Text>
                      <LinkButton
                        colorScheme="blue"
                        fontSize={'sm'}
                        height={'2em'}
                        size="sm"
                        href={`/dashboard/events/${id}/edit`}
                      >
                        Edit
                      </LinkButton>
                    </VStack>
                  ),
                }}
              />
            ),
          )}
        </HStack>
      </Box>
    </VStack>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
