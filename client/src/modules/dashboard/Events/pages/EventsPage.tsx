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
  Tooltip,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement, useState } from 'react';

import { isPast } from 'date-fns';
import { LockIcon } from '@chakra-ui/icons';
import { formatDate } from '../../../../util/date';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { useUser } from '../../../auth/user';
import { useDashboardEventsQuery } from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';
import {
  type ChapterPermission,
  Permission,
} from '../../../../../../common/permissions';
import { checkChapterPermission } from '../../../../util/check-permission';

interface FilterEventsProps {
  setFilterEvent: React.Dispatch<React.SetStateAction<boolean>>;
  defaultChecked: boolean;
  filterLabel: string;
  id: string;
}

const FilterEvents = ({
  setFilterEvent,
  defaultChecked,
  filterLabel,
  id,
}: FilterEventsProps) => {
  return (
    <>
      <FormLabel marginTop=".5em" htmlFor={id}>
        {filterLabel}
      </FormLabel>
      <Switch
        isChecked={defaultChecked}
        id={id}
        onChange={(e) => setFilterEvent(e.target.checked)}
      />
    </>
  );
};

export const EventsPage: NextPageWithLayout = () => {
  const [hideCanceled, setHideCanceled] = useState(false);
  const [hideEnded, setHideEnded] = useState(false);

  const { error, loading, data } = useDashboardEventsQuery();

  const { user } = useUser();

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  const checkHasEventPermision = (permission: ChapterPermission) => {
    return data.dashboardEvents.some(({ id }) =>
      checkChapterPermission(user, permission, {
        chapterId: id,
      }),
    );
  };

  const hasPermissionToCreateEvent = checkHasEventPermision(
    Permission.EventCreate,
  );
  const hasPermissiontoEditEvent = checkHasEventPermision(Permission.EventEdit);

  const filterEnded = (event: { ends_at: string }) =>
    !isPast(new Date(event.ends_at));
  const filterCanceled = (event: { canceled: boolean }) => !event.canceled;

  const filteredEvents = data.dashboardEvents.filter(
    (event) =>
      (!hideCanceled || filterCanceled(event)) &&
      (!hideEnded || filterEnded(event)),
  );

  return (
    <VStack data-cy="events-dashboard">
      <Grid
        width="100%"
        alignItems="center"
        marginBlock="2em"
        gap="2em"
        gridTemplateColumns=".5fr 1fr 1fr 8em"
      >
        <Heading id="page-heading">Events</Heading>
        <Flex
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'revert' }}
          gridRow={{ base: '2', lg: '1' }}
          gridColumn={{ base: '1 / -1', md: '1 / 3', lg: '2 / 3' }}
        >
          <FilterEvents
            defaultChecked={hideEnded}
            setFilterEvent={setHideEnded}
            filterLabel="Hide events that have ended"
            id={'hide-ended-events'}
          />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'revert' }}
          gridRow={{ base: '3', md: '2', lg: '1' }}
          gridColumn={{ base: '1 / -1', md: '-3 / -1', lg: '3 / 4' }}
          marginLeft={{ base: 'revert', md: 'auto', lg: 'revert' }}
        >
          <FilterEvents
            defaultChecked={hideCanceled}
            setFilterEvent={setHideCanceled}
            filterLabel="Hide canceled events"
            id={'hide-canceled-events'}
          />
        </Flex>
        {hasPermissionToCreateEvent && (
          <LinkButton
            data-cy="new-event"
            href="/dashboard/events/new"
            colorScheme={'blue'}
            gridColumn="-2 / -1"
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
          data={filteredEvents}
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
            'invite only': (event) =>
              event.invite_only ? (
                <HStack>
                  <Tooltip label="Invite only">
                    <LockIcon />
                  </Tooltip>
                  <Text>Yes</Text>
                </HStack>
              ) : (
                <Text>No</Text>
              ),
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
              <>
                {hasPermissiontoEditEvent && (
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
                )}
              </>
            ),
          }}
        />
      </Box>

      <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
        {filteredEvents.map(
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
              data={[filteredEvents[index]]}
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
                    {hasPermissiontoEditEvent && <Text>Actions</Text>}
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
                    {invite_only ? (
                      <HStack>
                        <Tooltip label="Invite only">
                          <LockIcon />
                        </Tooltip>
                        <Text>Yes</Text>
                      </HStack>
                    ) : (
                      <Text>No</Text>
                    )}
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
                    {hasPermissiontoEditEvent && (
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
                    )}
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
