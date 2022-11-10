import {
  Heading,
  VStack,
  Grid,
  GridItem,
  Button,
  useToast,
  Flex,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import React, { useState } from 'react';
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
    <>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle> This is a testing site. </AlertTitle>
        <AlertDescription>
          Unless you are a freeCodeCamp staff member or a Chapter maintainer,
          please do not use this site. Any data you enter will be deleted
          periodically.
        </AlertDescription>
      </Alert>
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
    </>
  );
};
const Home = () => {
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useHomeQuery({
    variables: { offset: 0, limit: 2 },
  });
  const { user } = useAuth();

  const toast = useToast();
  const onLoadMore = async () => {
    try {
      const res = await fetchMore({
        variables: { offset: data?.paginatedEvents.length },
      });
      setHasMore(res.data.paginatedEvents.length > 0);
    } catch (err) {
      if (err instanceof Error) {
        toast({ title: err.message || err.name });
      } else {
        toast({ title: 'An unexpected error occurred' });
        console.log(err);
      }
    }
  };

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
