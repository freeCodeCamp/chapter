import {
  Heading,
  VStack,
  Grid,
  GridItem,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Link } from 'chakra-next-link';
import { Loading } from 'components/Loading';
import { ChapterCard } from 'components/ChapterCard';
import { EventCard } from 'components/EventCard';
import { useHomeQuery } from 'generated/graphql';

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

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={10} mt="5">
      <GridItem colSpan={{ base: 2, xl: 1 }}>
        <VStack align="flex-start">
          <Heading>Upcoming events</Heading>
          <Link
            href={`/events/`}
            _hover={{ color: 'blue' }}
            textDecoration={'underline'}
          >
            View events list
          </Link>
          {data.paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {hasMore ? (
            <Button onClick={onLoadMore}>Click for more</Button>
          ) : (
            <Heading size="md">No more</Heading>
          )}
        </VStack>
      </GridItem>
      <GridItem colSpan={{ base: 2, xl: 1 }}>
        <VStack align="flex-start">
          <Heading>Chapters</Heading>
          <Link
            href={`/chapters/`}
            _hover={{ color: 'blue' }}
            textDecoration={'underline'}
          >
            View chapters list
          </Link>
          {data.chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default Home;
