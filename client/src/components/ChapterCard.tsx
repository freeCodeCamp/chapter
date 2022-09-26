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
      maxWidth={'80%'}
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
              <Text color={'darkcyan'} fontWeight="bold" as="h4">
                {chapter.category}
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
          {chapter.events.map(({ id, name, venue }, index) => (
            <Link key={id} href={`/events/${id}`} _hover={{}}>
              <Flex
                direction={['column', 'column', 'row']}
                paddingInline={'1em'}
                paddingBlock={'.5em'}
                justifyContent={'space-between'}
              >
                <Text mt="2" fontWeight={600} fontSize={['sm', 'md', 'lg']}>
                  {index + 1}. {name}
                </Text>
                {venue && <Text>{venue.name}</Text>}
              </Flex>
            </Link>
          ))}
        </GridItem>
      </Grid>
    </Grid>
  );
};
