import { NextPage } from 'next';
import React, { useMemo } from 'react';
import { Flex, Heading, VStack, Stack, Text } from '@chakra-ui/react';
import { Link, LinkButton } from 'chakra-next-link';
import { Loading } from '../../../components/Loading';
import { EventCard } from '../../../components/EventCard';
import { usePaginatedEventsWithTotalQuery } from '../../../generated/graphql';
import { useUser } from '../../auth/user';
import { Pagination } from '../../util/pagination';
import { checkInstancePermission } from '../../../util/check-permission';
import { Permission } from '../../../../../common/permissions';

const eventCards = 5;
export const EventsPage: NextPage = () => {
  const { user } = useUser();
  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventCards, showOnlyUpcoming: false },
  });

  const events = useMemo(
    () =>
      data?.paginatedEventsWithTotal.flatMap((eventData) => eventData.events) ??
      [],
    [data?.paginatedEventsWithTotal],
  );

  const currentPage = useMemo(
    () => Math.ceil(events.length / eventCards),
    [events],
  );

  const onClickForMore = () => {
    const offset = currentPage * eventCards;
    fetchMore({
      variables: { offset, limit: eventCards },
    });
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading error={error} />;
  // we need to do this because the data is array of event for every total?
  const totalEvents = data?.paginatedEventsWithTotal
    .flatMap((eventData) => eventData.total)
    .reduce(Number);

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="37.5em" spacing={6} mt={10} mb={5}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Heading as="h1">Events: </Heading>
          {checkInstancePermission(user, Permission.EventsView) && (
            <LinkButton href="/dashboard/events" colorScheme={'blue'}>
              Events Dashboard
            </LinkButton>
          )}
        </Flex>
        {
          <>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </>
        }
        <Pagination
          currentPage={currentPage}
          onClickForMore={() => onClickForMore()}
          eventCards={eventCards}
          records={totalEvents || 0}
          displayOnEmpty={
            checkInstancePermission(user, Permission.EventsView) && (
              <Text size="md">
                No more, you can create event in{' '}
                <Link
                  href="/dashboard/paginatedEventsWithTotal"
                  fontWeight="bold"
                >
                  Event dashboard
                </Link>
                .
              </Text>
            )
          }
        />
      </Stack>
    </VStack>
  );
};
