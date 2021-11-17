import { Heading, VStack, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { EventCard } from 'components/EventCard';
import { useMinEventsQuery } from 'generated/graphql';

export const EventsPage: NextPage = () => {
  const { loading, error, data } = useMinEventsQuery();

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
        {data.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Stack>
    </VStack>
  );
};
