import { Heading, VStack, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Button, Box, Flex } from '@chakra-ui/react';
import { EventCard } from 'components/EventCard';
import { usePaginatedEventsWithTotalQuery } from 'generated/graphql';

export const Pagination = ({
  currentPage = 1,
  setCurrentPage,
  pageSize,
  records,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  records: number;
}) => {
  const totalPages = Math.ceil(records / pageSize);

  return (
    <Flex alignItems={'center'} justifyContent={'center'}>
      <Button
        colorScheme="blue"
        data-testid="pagination-back"
        disabled={!(currentPage > 1)}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        Previous Page
      </Button>
      <Box
        p={['1', '2.5']}
        fontSize={['sm', 'md']}
        fontWeight={'500'}
        data-testid="current-page"
      >
        {currentPage}
      </Box>
      <Box p={['1', '2.5']} fontSize={['sm', 'md']} fontWeight={'500'}>
        of
      </Box>
      <Box
        p={['1', '2.5']}
        fontSize={['sm', 'md']}
        fontWeight={'500'}
        data-testid="total-pages"
      >
        {totalPages}
      </Box>
      <Button
        colorScheme="blue"
        data-testid="pagination-forward"
        disabled={!(currentPage < totalPages)}
        onClick={() =>
          currentPage < totalPages && setCurrentPage(currentPage + 1)
        }
      >
        Next Page
      </Button>
    </Flex>
  );
};
const pageSize = 5;
export const EventsPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: (currentPage - 1) * pageSize, limit: pageSize },
  });

  useEffect(() => {
    fetchMore({
      variables: {
        offset: data?.paginatedEventsWithTotal.events.length || 0,
        limit: pageSize,
      },
    });
  }, [currentPage]);
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.paginatedEventsWithTotal.events.length) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Heading>Events: </Heading>
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
