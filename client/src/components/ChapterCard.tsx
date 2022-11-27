import { Heading, Grid, Text, GridItem, Flex } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { ChaptersQuery } from 'generated/graphql';

type ChapterCardProps = {
  chapter: ChaptersQuery['chapters'][number];
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Grid
      data-cy="chapter-card"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width={'full'}
      minW={'20em'}
      gap={'2'}
    >
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={'3'}
        marginRight={'1em'}
        marginBlock={'.5em'}
      >
        <GridItem paddingInline={'1em'} paddingBlock={'.5em'} colSpan={3}>
          <Flex justifyContent={'space-between'}>
            <Heading
              data-cy="chapter-heading"
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
              as="h3"
            >
              <Link href={`/chapters/${chapter.id}`} _hover={{}}>
                {chapter.name}
              </Link>
            </Heading>
            <Text color={'darkcyan'} fontWeight="bold" as="h4">
              {chapter.city}
            </Text>
          </Flex>
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
          {chapter.events.map(({ id, name, venue, capacity }, index) => (
            <Flex
              direction={'column'}
              paddingLeft={'1em'}
              paddingBlock={'.5em'}
              justifyContent={'space-between'}
              key={id}
            >
              <Flex justifyContent={'space-between'}>
                <Link
                  href={`/events/${id}`}
                  _hover={{}}
                  mt="2"
                  fontWeight={600}
                  fontSize={['sm', 'md', 'lg']}
                >
                  {index + 1}. {name}
                </Link>
                <Text
                  mt="2"
                  fontWeight={600}
                  fontSize={['sm', 'md', 'lg']}
                  color={'darkcyan'}
                >
                  Capacity:{capacity}
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
          ))}
        </GridItem>
      </Grid>
    </Grid>
  );
};
