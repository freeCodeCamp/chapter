import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([1]));
  const { user } = useUser();
  const offset = (currentPage - 1) * eventCards;
  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset, limit: eventCards },
  });

  useEffect(() => {
    if (visitedPages.has(currentPage)) return;
    fetchMore({
      variables: { offset, limit: eventCards },
    });
    setVisitedPages(new Set(visitedPages).add(currentPage));
  }, [currentPage]);

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading error={error} />;
  const totalEvents = data?.paginatedEventsWithTotal
    .map(({ total }) => total)
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
        {data?.paginatedEventsWithTotal.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          eventCards={eventCards}
          records={totalEvents || 0}
          displayOnEmpty={
            checkInstancePermission(user, Permission.EventsView) && (
              <Text size="md">
                No more, you can create event in{' '}
                <Link href="/dashboard/events" fontWeight="bold">
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
