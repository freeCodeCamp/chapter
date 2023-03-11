import { Heading, VStack, Grid, GridItem, Flex, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Link } from 'chakra-next-link';

import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import {
  usePaginatedEventsWithTotalQuery,
  useChaptersLazyQuery,
} from '../../generated/graphql';
import { Pagination } from '../util/pagination';
import { UserContextType, useUser } from '../auth/user';
import { getNameText } from '../../components/UserName';

const eventsPerPage = 2;

type User = NonNullable<UserContextType['user']>;

const Welcome = ({ user }: { user: User }) => {
  return (
    <Flex
      alignItems={'center'}
      justifyContent="space-between"
      marginBlockStart="1.25em"
    >
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
  const [getChapters, { error: chapterErrors, data: chapterDatas }] =
    useChaptersLazyQuery();

  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventsPerPage },
  });
  const { user } = useUser();

  useEffect(() => {
    if (!loading) {
      getChapters();
    }
  }, [loading]);

  const isLoading = loading || !data;
  if (isLoading) return <Loading error={error} />;

  const items = data.paginatedEventsWithTotal.events.map((event) => (
    <EventCard key={event.id} event={event} />
  ));

  return (
    <>
      {user ? (
        <Welcome user={user} />
      ) : (
        <Heading as="h1" marginBlockStart="1.25em">
          Welcome to Chapter
        </Heading>
      )}
      <Grid templateColumns="repeat(2, 1fr)" gap={10} mt="5">
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Upcoming events
            </Heading>
            <Pagination
              items={items}
              fetchMore={fetchMore}
              limit={eventsPerPage}
              total={data.paginatedEventsWithTotal.total || 0}
              displayOnEmpty={
                <Text size="md">
                  No more, check out the{' '}
                  <Link href="/events" fontWeight="bold">
                    Event page{' '}
                  </Link>
                  to see past events.
                </Text>
              }
            />
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Chapters
            </Heading>
            {chapterDatas ? (
              chapterDatas.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <Loading error={chapterErrors} />
            )}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
