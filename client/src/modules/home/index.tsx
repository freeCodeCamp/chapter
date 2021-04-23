import React from 'react';
import Link from 'next/link';
import {
  Heading,
  Spinner,
  VStack,
  Text,
  Box,
  Tag,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { useHomePageQuery } from 'generated/graphql';

const Card: React.FC = ({ children }) => {
  return (
    <Box p="4" w="50%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      {children}
    </Box>
  );
};

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
        data.events.map((event) => (
          <Card key={event.id}>
            <Flex justify="space-between">
              <Heading size="md" as="h2">
                <Link href={`/events/${event.id}`} passHref>
                  <a>{event.name}</a>
                </Link>
              </Heading>
              <HStack>
                {event.tags?.map((t) => (
                  <Tag key={t.name}>{t.name}</Tag>
                ))}
              </HStack>
            </Flex>

            <Heading size="sm">
              {format(new Date(event.start_at), 'E, LLL d @ HH:MM')}
            </Heading>
            <Link href={`/chapters/${event.chapter.id}`}>
              {event.chapter.name}
            </Link>

            <Text>{event.description}</Text>
          </Card>
        ))
      )}
    </VStack>
  );
};

export default Home;
