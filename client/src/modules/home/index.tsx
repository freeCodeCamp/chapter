import {
  Heading,
  Spinner,
  VStack,
  Text,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { ChapterCard } from 'components/ChapterCard';
import { EventCard } from 'components/EventCard';
import { Pagination } from 'modules/events/pages/eventsPage';
import { useHomeQuery } from 'generated/graphql';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const { loading, error, data } = useHomeQuery({
    variables: { offset: (currentPage - 1) * pageSize, limit: pageSize },
  });

  return (
    <>
      <Grid>
        <Flex
          gap={'2'}
          minH={'15vh'}
          maxH={'60vh'}
          width={'100%'}
          background={'gray.05'}
          color={'gray.90'}
          padding={2}
          direction={'column'}
          alignItems={'center'}
        >
          <Heading
            as="h1"
            fontWeight={800}
            marginBlock={'3'}
            width={{ base: '80vw', lg: '60vw', xl: '40vw' }}
          >
            A self-hosting event management tool for non-profits
          </Heading>
          <Text
            width={{ base: '80vw', lg: '60vw', xl: '40vw' }}
            marginInline={3}
            fontSize={['md', 'lg', 'xl']}
            letterSpacing={'wide'}
            as="p"
          >
            After several years of being dissatisfied with existing group event
            tools we decided to build our own.
          </Text>
          <Text
            width={{ base: '80vw', lg: '60vw', xl: '40vw' }}
            mt={3}
            marginInline={3}
            letterSpacing={'wide'}
            fontSize={['md', 'lg', 'xl']}
            paddingBlock={3}
            as="p"
          >
            This will be a self-hosted Docker container deployed to the cloud
            with a one-click and then configured by the <i>owner</i>. No coding
            required.
          </Text>
        </Flex>

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
              <Grid alignItems="flex-start">
                <GridItem>
                  <Heading>Upcoming events</Heading>
                </GridItem>
                <GridItem>
                  <Flex>
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
                  </Flex>
                </GridItem>
                {data ? (
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    records={data.paginatedEvents.length}
                  />
                ) : (
                  <Heading size="md">No more</Heading>
                )}
              </Grid>
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
