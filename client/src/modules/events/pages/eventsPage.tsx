import { Heading, VStack, Stack, Center } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Button, Box, Flex } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';
import { Loading } from '../../../components/Loading';
import { EventCard } from '../../../components/EventCard';
import { usePaginatedEventsWithTotalQuery } from '../../../generated/graphql';
import { useAuth } from '../../../modules/auth/store';
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
    <Flex>
      <Center>
        <Button
          background="gray.85"
          color="gray.10"
          _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          _focusVisible={{
            outlineColor: 'blue.600',
            outlineOffset: '1px',
            boxShadow: 'none',
          }}
          data-testid="pagination-back"
          disabled={!(currentPage > 1)}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          &lt;
        </Button>
        <Box p="5">Page</Box>
        <Box p="5" data-testid="current-page">
          {currentPage}
        </Box>
        <Box p="5">of</Box>
        <Box p="5" data-testid="total-pages">
          {totalPages}
        </Box>
        <Button
          background="gray.85"
          color="gray.10"
          _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          _focusVisible={{
            outlineColor: 'blue.600',
            outlineOffset: '1px',
            boxShadow: 'none',
          }}
          data-testid="pagination-forward"
          disabled={!(currentPage < totalPages)}
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
        >
          &gt;
        </Button>
      </Center>
    </Flex>
  );
}
const pageSize = 5;
export const EventsPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([1]));
  const { user } = useAuth();
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
            <LinkButton
              href="/dashboard/events"
              background="gray.85"
              color="gray.10"
              _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
              _focusVisible={{
                outlineColor: 'blue.600',
                outlineOffset: '1px',
                boxShadow: 'none',
              }}
            >
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
