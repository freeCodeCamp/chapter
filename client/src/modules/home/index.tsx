import React from 'react';
import {
  Heading,
  Spinner,
  VStack,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useHomePageQuery } from 'generated/graphql';
import { EventCard } from 'components/EventCard';

const Home: React.FC = () => {
  const { loading, error, data } = useHomePageQuery();

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
            data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
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
