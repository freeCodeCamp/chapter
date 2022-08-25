import {
  Heading,
  Spinner,
  VStack,
  Text,
  Grid,
  GridItem,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

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

  return (
    <>
      <Grid>
        <GridItem width={'100%'} height={'50%'} margin={2}>
          <Grid
            templateColumns={['1fr', '1fr', '1fr 2fr']}
            gap={'2'}
            background={'gray.05'}
            color={'gray.90'}
            placeItems="center"
            minH={'30vh'}
            height={'fit-content'}
            maxH={'60vh'}
          >
            <GridItem marginInline={3}>
              <Heading as="h1" fontWeight={800}>
                A self-hosting event management tool for non-profits
              </Heading>
            </GridItem>
            <GridItem fontWeight="500">
              <Text
                marginInline={3}
                fontSize={['md', 'lg', 'xl']}
                letterSpacing={'wide'}
                as="p"
              >
                After several years of being dissatisfied with existing group
                event tools (Meetup, Facebook events) we decided to build our
                own.
              </Text>
              <Text
                mt={3}
                marginInline={3}
                letterSpacing={'wide'}
                fontSize={['md', 'lg', 'xl']}
                as="p"
              >
                This will be a self-hosted Docker container deployed to the
                cloud with a one-click and then configured by the <i>owner</i>.
                No coding required.
              </Text>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem>
          <Grid
            gap={10}
            paddingBlock="5"
            paddingInline={'2'}
            background={'gray.85'}
            color={'gray.00'}
            width={'100vw'}
          >
            <GridItem marginLeft={2}>
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
            <GridItem marginLeft={2}>
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
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
