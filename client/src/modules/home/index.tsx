import React from 'react';
import { Heading, Spinner, VStack, Text } from '@chakra-ui/react';

import { useHomePageQuery } from 'generated/graphql';
import { EventCard } from 'components/EventCard';

const Home: React.FC = () => {
  const { loading, error, data } = useHomePageQuery();

  return (
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
        data.events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </VStack>
  );
};

export default Home;
