import { Heading, VStack, Grid, GridItem, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'chakra-next-link';

import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import {
  usePaginatedEventsWithTotalQuery,
  useChaptersQuery,
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
  const { error: chapterError, data: chapterData } = useChaptersQuery();

  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventsPerPage },
  });
  const { user } = useUser();

  const isLoading = loading || !data || !chapterData;
  if (isLoading) return <Loading error={error || chapterError} />;

  const currentPage = Math.ceil(
    data.paginatedEventsWithTotal.events.length / eventsPerPage,
  );

  const onClickForMore = () => {
    const offset = currentPage * eventsPerPage;
    fetchMore({
      variables: { offset, limit: eventsPerPage },
    });
  };

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
              data={data.paginatedEventsWithTotal.events}
              mapper={(event) => <EventCard key={event.id} event={event} />}
              currentPage={currentPage}
              onClickForMore={() => onClickForMore()}
              itemsPerPage={eventsPerPage}
              records={data.paginatedEventsWithTotal.total || 0}
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
            {chapterData.chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
