import {
  Box,
  Flex,
  Grid,
  FormLabel,
  Heading,
  HStack,
  Text,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement, useState } from 'react';

import { isPast } from 'date-fns';
import { formatDate } from '../../../../util/date';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { useUser } from '../../../auth/user';
import { useDashboardEventsQuery } from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';

interface FilterEventsProps {
  setFilterEvent: React.Dispatch<React.SetStateAction<boolean>>;
  defaultChecked: boolean;
  filterLabel: string;
}

const FilterEvents = ({
  setFilterEvent,
  defaultChecked,
  filterLabel,
}: FilterEventsProps) => {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <FormLabel marginTop=".5em" htmlFor="show-canceled-events">
        {filterLabel}
      </FormLabel>
      <Switch
        isChecked={defaultChecked}
        id="show-canceled-events"
        onChange={(e) => setFilterEvent(e.target.checked)}
      />
    </Flex>
  );
};

export const EventsPage: NextPageWithLayout = () => {
  const [showCanceled, setShowCanceled] = useState(true);
  const [showRecent, setShowRecent] = useState(true);

  const { error, loading, data } = useDashboardEventsQuery({
    variables: { showCanceled, showRecent },
  });

  const { user } = useUser();

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <VStack data-cy="events-dashboard">
      <Grid
        width="100%"
        alignItems="center"
        marginBlock="2em"
        gap="2em"
        gridTemplateColumns="repeat(auto-fit, minmax(10rem, 1fr))"
      >
        <Heading id="page-heading">Events</Heading>
        <FilterEvents
          defaultChecked={showCanceled}
          setFilterEvent={setShowCanceled}
          filterLabel="Show canceled events"
        />
        <FilterEvents
          defaultChecked={showRecent}
          setFilterEvent={setShowRecent}
          filterLabel="Show recent events"
        />
        {!!user?.admined_chapters.length && (
          <LinkButton
            data-cy="new-event"
            href="/dashboard/events/new"
            colorScheme={'blue'}
          >
            Add new
            <Text srOnly as="span">
              Event
            </Text>
          </LinkButton>
        )}
      </Grid>
      <Box
        display={{ base: 'none', lg: 'block' }}
        width={'100%'}
        marginBlock={'2em'}
      >
        <DataTable
          tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
          data={data.dashboardEvents}
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
              event.canceled ? (
                <Text
                  color="red.500"
                  data-cy="event-canceled"
                  fontSize={['md', 'lg']}
                  fontWeight={'semibold'}
                >
                  Canceled
                </Text>
              ) : isPast(new Date(event.ends_at)) ? (
                <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                  Ended
                </Text>
              ) : isPast(new Date(event.start_at)) ? (
                <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                  Running
                </Text>
              ) : (
                <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                  Upcoming
                </Text>
              ),
            name: (event) => (
              <VStack align="flex-start">
                <LinkButton
                  data-cy="event"
                  colorScheme={event.canceled ? 'red' : undefined}
                  href={`/dashboard/events/${event.id}`}
                >
                  {event.name}
                </LinkButton>
              </VStack>
            ),
            'invite only': (event) => (event.invite_only ? 'Yes' : 'No'),
            venue: (event) => (
              <Text data-cy="venue">
                {isPhysical(event.venue_type)
                  ? event.venue?.name || 'TBD'
                  : 'Online only'}
              </Text>
            ),
            capacity: true,
            streaming_url: (event) => (
              <Text data-cy="streamingUrl">
                {isOnline(event.venue_type)
                  ? event.streaming_url || 'TBD'
                  : 'In-person only'}
              </Text>
            ),
            date: (event) => formatDate(event.start_at),
            action: (event) => (
              <LinkButton
                colorScheme="blue"
                size="sm"
                href={`/dashboard/events/${event.id}/edit`}
              >
                Edit
                <Text srOnly as="span">
                  {event.name}
                </Text>
              </LinkButton>
            ),
          }}
        />
      </Box>

      <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
        {data.dashboardEvents.map(
          (
            {
              canceled,
              name,
              id,
              start_at,
              ends_at,
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
              data={[data.dashboardEvents[index]]}
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
                      ) : isPast(new Date(ends_at)) ? (
                        <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                          Ended
                        </Text>
                      ) : isPast(new Date(start_at)) ? (
                        <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                          Running
                        </Text>
                      ) : (
                        <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                          Upcoming
                        </Text>
                      )}
                    </HStack>
                    <VStack align="flex-start">
                      <LinkButton
                        data-cy="event"
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
                        ? venue?.name || 'TBD'
                        : 'Online only'}
                    </Text>
                    <Text>{capacity}</Text>
                    <Text>
                      {isOnline(venue_type)
                        ? streaming_url || 'TBD'
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
                      <Text srOnly as="span">
                        {name}
                      </Text>
                    </LinkButton>
                  </VStack>
                ),
              }}
            />
          ),
        )}
      </Box>
    </VStack>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
