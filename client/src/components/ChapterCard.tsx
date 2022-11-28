import { Grid, Text, GridItem, Flex } from '@chakra-ui/react';
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
          <Link href={`/chapters/${chapter.id}`} _hover={{}}>
            <Flex justifyContent={'space-between'}>
              <Text
                data-cy="chaptercard-name"
                fontSize={['lg', 'xl', '2xl']}
                fontWeight={700}
                fontFamily={'body'}
              >
                {chapter.name}
              </Text>
              <Text color={'darkcyan'} fontWeight="bold">
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
          <Text
            fontSize={['md', 'lg', 'xl']}
            fontWeight={'500'}
            paddingInline={'1em'}
            paddingBlock={'.5em'}
          >
            Organized Events
          </Text>
          {chapter.events.map(({ id, name, venue, capacity }, index) => (
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
                    fontSize={['smaller', 'sm', 'md']}
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
            </Link>
          ))}
        </GridItem>
      </Grid>
    </Grid>
  );
};
