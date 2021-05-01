import React, { useState } from 'react';
import {
  Heading,
  Spinner,
  VStack,
  Text,
  Grid,
  GridItem,
  Button,
  useToast,
} from '@chakra-ui/react';

import { useHomeQuery } from 'generated/graphql';
import { EventCard } from 'components/EventCard';

const Home: React.FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useHomeQuery({
    variables: { offset: 0, limit: 2 },
  });

  const toast = useToast();
  const onLoadMore = async () => {
    try {
      const res = await fetchMore({
        variables: { offset: data?.paginatedEvents.length },
      });
      setHasMore(res.data.paginatedEvents.length > 0);
    } catch (err) {
      toast({ title: err.message || err.name || err });
    }
  };

  return (
    <Grid templateColumns="repeat(5, 1fr)" columnGap={10} mt="5">
      <GridItem colSpan={3}>
        <VStack align="flex-start">
          <Heading>Upcoming events</Heading>
          {loading ? (
            <Spinner />
          ) : error || !data ? (
            <>
              <Heading size="md" color="red.400">
                😕 Something went wrong
              </Heading>
              <Text>{error?.message}</Text>
            </>
          ) : (
            data.paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}

          {hasMore ? (
            <Button onClick={onLoadMore}>Click for more</Button>
          ) : (
            <Heading size="md">No more</Heading>
          )}
        </VStack>
      </GridItem>
      <GridItem colSpan={2}>
        <Heading>Something here</Heading>
      </GridItem>
    </Grid>
  );
};

export default Home;
