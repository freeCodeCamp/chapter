import { Heading, VStack, Grid, GridItem, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'chakra-next-link';

import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import { useHomeQuery } from '../../generated/graphql';
import { AuthContextType, useAuth } from '../../modules/auth/store';
import { getNameText } from '../../components/UserName';

type User = NonNullable<AuthContextType['user']>;

const Welcome = ({ user }: { user: User }) => {
  return (
    <Flex alignItems={'center'} justifyContent="space-between">
      <Heading as="h1">Welcome, {getNameText(user.name)}</Heading>
      {!user.name && (
        <Text>
          You can set your name on your{' '}
          <Link
            href="/profile"
            textDecoration={'underline'}
            _hover={{ textDecoration: 'none' }}
          >
            profile page
          </Link>
        </Text>
      )}
    </Flex>
  );
};
const Home = () => {
  const { loading, error, data } = useHomeQuery();
  const { user } = useAuth();

  const eventData = data?.paginatedEvents;
  const UpcomingEvents = eventData?.filter(({ canceled }) => {
    canceled;
  });
  console.log(eventData);
  console.log(UpcomingEvents);

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

  return (
    <>
      {user ? (
        <Welcome user={user} />
      ) : (
        <Heading as="h1">Welcome to Chapter</Heading>
      )}
      <Grid templateColumns="repeat(2, 1fr)" gap={10} mt="5">
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Upcoming events
            </Heading>
            {UpcomingEvents?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Chapters
            </Heading>
            {data.chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
