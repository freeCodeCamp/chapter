import { Heading, VStack, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Button, Text, Flex } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';
import { Loading } from '../../../components/Loading';
import { EventCard } from '../../../components/EventCard';
import { usePaginatedEventsWithTotalQuery } from '../../../generated/graphql';
import { useUser } from '../../auth/user';
import { checkPermission } from '../../../util/check-permission';
import { Permission } from '../../../../../common/permissions';

function Pagination({
  currentPage = 1,
  setCurrentPage,
  pageSize,
  records,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  records: number;
}) {
  const totalPages = Math.ceil(records / pageSize);

  return (
    <Flex gap="1em" alignItems="center">
      <Button
        colorScheme="blue"
        data-testid="pagination-back"
        fontWeight="600"
        fontSize="xl"
        disabled={!(currentPage > 1)}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        <Text srOnly>Previous page</Text>
        &lt;
      </Button>
      <Text data-testid="current-page">{currentPage}</Text>
      <Text>of</Text>
      <Text data-testid="total-pages">{totalPages}</Text>
      <Button
        colorScheme="blue"
        data-testid="pagination-forward"
        fontWeight="600"
        fontSize="xl"
        disabled={!(currentPage < totalPages)}
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
      >
        <Text srOnly>Next Page</Text>
        &gt;
      </Button>
    </Flex>
  );
}
const pageSize = 5;
export const EventsPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([1]));
  const { user } = useUser();
  const offset = (currentPage - 1) * pageSize;
  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset, limit: pageSize },
  });

  useEffect(() => {
    if (visitedPages.has(currentPage)) return;
    fetchMore({
      variables: { offset, limit: pageSize },
    });
    setVisitedPages(new Set(visitedPages).add(currentPage));
  }, [currentPage]);

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="37.5em" spacing={6} mt={10} mb={5}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Heading as="h1">Events: </Heading>
          {checkPermission(user, Permission.EventsView) && (
            <LinkButton href="/dashboard/events" colorScheme={'blue'}>
              Events Dashboard
            </LinkButton>
          )}
        </Flex>
        {data?.paginatedEventsWithTotal.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          records={data?.paginatedEventsWithTotal.total || 0}
        />
      </Stack>
    </VStack>
  );
};
