import {
  Heading,
  VStack,
  Grid,
  GridItem,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link } from 'chakra-next-link';

import { useAlert } from '../../hooks/useAlert';
import { Loading } from '../../components/Loading';
import { ChapterCard } from '../../components/ChapterCard';
import { EventCard } from '../../components/EventCard';
import { useHomeQuery } from '../../generated/graphql';
import { UserContextType, useUser } from '../auth/user';
import { getNameText } from '../../components/UserName';

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
  const { loading, error, data, fetchMore } = useHomeQuery({
    variables: { offset: 0, limit: 2 },
  });
  const { user } = useUser();

  const addAlert = useAlert();
  const onLoadMore = async () => {
    try {
      const res = await fetchMore({
        variables: { offset: data?.paginatedEvents.length },
      });
      setHasMore(res.data.paginatedEvents.length > 0);
    } catch (err) {
      if (err instanceof Error) {
        addAlert({ title: err.message || err.name });
      } else {
        addAlert({ title: 'An unexpected error occurred' });
      }
    }
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading error={error} />;

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
            {data.paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {hasMore ? (
              <Button onClick={onLoadMore}>Click for more</Button>
            ) : (
              <Text size="md">No more</Text>
            )}
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
