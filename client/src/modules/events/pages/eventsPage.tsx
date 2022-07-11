import { Heading, VStack, Stack, Center } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { Button, Box, Flex } from '@chakra-ui/react';
import { EventCard } from 'components/EventCard';
import { useMinEventsQuery } from 'generated/graphql';

export default function Pagination({
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
          colorScheme="blue"
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
          colorScheme="blue"
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

export const EventsPage: NextPage = () => {
  const { loading, error, data } = useMinEventsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginated = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;
    return data?.events.slice(offset, offset + pageSize); // 0 , 4 // 5, 10
  }, [currentPage, pageSize, data?.events]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.events) {
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
        {paginated?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          records={data.events.length}
        />
      </Stack>
    </VStack>
  );
};
