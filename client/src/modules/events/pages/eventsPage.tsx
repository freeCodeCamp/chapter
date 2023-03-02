import { NextPage } from 'next';
import React from 'react';
import { Flex, Heading, VStack, Stack, Text } from '@chakra-ui/react';
import { Link, LinkButton } from 'chakra-next-link';
import { Loading } from '../../../components/Loading';
import { EventCard } from '../../../components/EventCard';
import { usePaginatedEventsWithTotalQuery } from '../../../generated/graphql';
import { useUser } from '../../auth/user';
import { Pagination } from '../../util/pagination';
import { checkInstancePermission } from '../../../util/check-permission';
import { Permission } from '../../../../../common/permissions';

const eventsPerPage = 5;

export const EventsPage: NextPage = () => {
  const { user } = useUser();
  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventsPerPage, showOnlyUpcoming: false },
  });

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading error={error} />;

  const items = data.paginatedEventsWithTotal.events.map((event) => (
    <EventCard key={event.id} event={event} />
  ));

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
        <Pagination
          items={items}
          fetchMore={fetchMore}
          limit={eventsPerPage}
          total={data.paginatedEventsWithTotal.total || 0}
          displayOnEmpty={
            checkInstancePermission(user, Permission.EventsView) && (
              <Text size="md">
                No more events. Go to the{' '}
                <Link href="/dashboard/events" fontWeight="bold">
                  Event dashboard{' '}
                </Link>
                to create more.
              </Text>
            )
          }
        />
      </Stack>
    </VStack>
  );
};
