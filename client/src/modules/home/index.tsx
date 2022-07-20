import {
  Heading,
  Spinner,
  VStack,
  Text,
  Grid,
  GridItem,
  Button,
  useToast,
  Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { ChapterCard } from 'components/ChapterCard';
import { EventCard } from 'components/EventCard';
import { useHomeQuery } from 'generated/graphql';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // TODO: If the user reloads the page this fails on Brave, because it cannot
  // store the necessary cookies. We might be able to work around this with
  // refresh tokens.

  const [message, setMessage] = useState('');

  const login = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${serverUrl}/logout`, {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log(response);

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  if (!isAuthenticated) return null;
  if (!user) return <> User Not Found</>;

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <h3>User Metadata</h3>
      <Button onClick={login}>LOGIN</Button>
      <Button onClick={logout}>LOGOUT</Button>
      <Box>message received: {message}</Box>
    </div>
  );
};

const Home = () => {
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useHomeQuery({
    variables: { offset: 0, limit: 2 },
  });

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

  return (
    <Grid templateColumns="repeat(3, 1fr)" columnGap={10} mt="5">
      <GridItem colSpan={{ base: 3, md: 2 }}>
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
            data.paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}

          {hasMore ? (
            <Button onClick={onLoadMore}>Click for more</Button>
          ) : (
            <Heading size="md">No more</Heading>
          )}
        </VStack>
      </GridItem>
      <Profile />
      <GridItem colSpan={{ base: 3, md: 1 }}>
        <VStack align="flex-start">
          <Heading>Chapters</Heading>
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
            data.chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default Home;
