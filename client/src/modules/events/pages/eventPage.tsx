import React from 'react';
import { NextPage } from 'next';
import { useEventQuery } from 'generated/graphql';
import { useParam } from 'hooks/useParam';

import { Heading, VStack, Text } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';

export const EventPage: NextPage = () => {
  const id = useParam('eventId');

  const { loading, error, data } = useEventQuery({
    variables: { id: id || -1 },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.event) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <VStack align="flex-start">
      <Heading>{data.event.name}</Heading>
      <Heading size="md">
        Chapter:{' '}
        <Link href={`/chapters/${data.event.chapter.id}`}>
          {data.event.chapter.name}
        </Link>
      </Heading>
      <Text>{data.event.description}</Text>

      <Heading>RSVPs:</Heading>
    </VStack>
  );
};
