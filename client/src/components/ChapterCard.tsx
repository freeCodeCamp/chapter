import { Heading, Grid, Text, GridItem, Flex } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { ChaptersQuery } from 'generated/graphql';

type ChapterCardProps = {
  chapter: ChaptersQuery['chapters'][number];
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const canceledStyle = { 'data-cy': 'event-canceled', color: 'red.500' };
  return (
    <Grid
      data-cy="chapter-card"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="full"
      gap={'2'}
      backgroundImage={chapter.banner_url}
      backgroundPosition={'center'}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
    >
      <Grid
        templateColumns="repeat(2, 1fr)"
        height={'100%'}
        width={'100%'}
        gap={'3'}
        marginRight={'1em'}
        paddingBlock={'.5em'}
        color={'gray.00'}
        bgGradient="linear(to-b, hsl(240 14% 27% / .4), hsl(240 14% 27% / .7), hsl(240 14% 10%))"
      >
        <GridItem paddingInline={'1em'} paddingBlock={'.5em'} colSpan={3}>
          <Link href={`/chapters/${chapter?.id}`} _hover={{}}>
            <Flex justifyContent={'space-between'}>
              <Heading
                data-cy="chapter-heading"
                fontSize={'xl'}
                fontWeight={700}
                fontFamily={'body'}
                as="h3"
              >
                {chapter.name}
              </Heading>
              <Text color={'gray-00'} fontWeight="bold" as="h4">
                {chapter.city}
              </Text>
            </Flex>
          </Link>
        </GridItem>
        <GridItem
          colStart={1}
          colSpan={2}
          marginInline={'1em'}
          marginBlock={'.5em'}
        >
          <Text mt="2" as="p" fontWeight={400} fontSize={['sm', 'md', 'lg']}>
            {chapter.description}
          </Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Heading
            as="h3"
            fontSize={'md'}
            fontWeight={'500'}
            paddingInline={'1em'}
            paddingBlock={'.5em'}
          >
            Organized Events
          </Heading>
          {chapter.events.map(
            ({ id, name, venue, canceled, start_at }, index) => (
              <Link key={id} href={`/events/${id}`} _hover={{}}>
                <Flex
                  direction={'column'}
                  paddingLeft={'1em'}
                  paddingBlock={'.5em'}
                  justifyContent={'space-between'}
                >
                  <Flex justifyContent={'space-between'}>
                    <Text mt="2" fontWeight={600} fontSize={['sm', 'md', 'lg']}>
                      {index + 1}. {name}
                    </Text>
                    <Text
                      mt="2"
                      fontWeight={600}
                      fontSize={['sm', 'md', 'lg']}
                      {...canceledStyle}
                    >
                      {canceled
                        ? 'Canceled'
                        : new Date(start_at) < new Date()
                        ? 'Passed'
                        : 'Upcoming'}
                    </Text>
                  </Flex>
                  {venue && (
                    <Flex
                      fontWeight={'400'}
                      marginTop={'.25em'}
                      opacity=".9"
                      fontSize={['smaller', 'sm', 'md']}
                      justifyContent="space-between"
                    >
                      <Text>Hosted at: {venue.name}</Text>
                      <Text> {venue.region}</Text>
                    </Flex>
                  )}
                </Flex>
              </Link>
            ),
          )}
        </GridItem>
      </Grid>
    </Grid>
  );
};
