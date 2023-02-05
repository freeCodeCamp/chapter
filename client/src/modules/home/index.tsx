import {
  Heading,
  VStack,
  Grid,
  GridItem,
  Flex,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { Suspense, useState } from 'react';
import { Link } from 'chakra-next-link';

import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import {
  usePaginatedEventsWithTotalQuery,
  useChaptersLazyQuery,
} from '../../generated/graphql';
import { UserContextType, useUser } from '../auth/user';
import { getNameText } from '../../components/UserName';

const eventCards = 2;

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
  const [hasMore, setHasMore] = useState(true);
  const [getChapters, { error: chapterError, data: chapterData }] =
    useChaptersLazyQuery();

  const { loading, error, data, fetchMore } = usePaginatedEventsWithTotalQuery({
    variables: { offset: 0, limit: eventCards, showUpcoming: true },
    onCompleted() {
      getChapters();
    },
  });

  const { user } = useUser();

  const toast = useToast();
  const onLoadMore = async () => {
    try {
      const res = await fetchMore({
        variables: { offset: data?.paginatedEventsWithTotal.length },
      });
      setHasMore(res.data.paginatedEventsWithTotal.length > 0);
    } catch (err) {
      if (err instanceof Error) {
        toast({ title: err.message || err.name });
      } else {
        toast({ title: 'An unexpected error occurred' });
      }
    }
  };
  const isLoading = loading || !data;
  if (isLoading) return <Loading error={error} />;
  const totalEvents = data.paginatedEventsWithTotal
    .map(({ total }) => total)
    .reduce(Number);
  const showButton = totalEvents > eventCards && hasMore;

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
            <Suspense fallback={<Loading error={error} />}>
              {data?.paginatedEventsWithTotal.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Suspense>
            {showButton ? (
              <Button onClick={onLoadMore}>Click for more</Button>
            ) : (
              <Text size="md">
                No more, check out the{' '}
                <Link href="/events" fontWeight="bold">
                  Event page
                </Link>
              </Text>
            )}
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <VStack align="flex-start">
            <Heading as="h2" size={'md'}>
              Chapters
            </Heading>
            <Suspense fallback={<Loading error={chapterError} />}>
              {chapterData?.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </Suspense>
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
