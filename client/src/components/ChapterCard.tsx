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
    >
      <Grid minW={'25em'} maxW={'35em'} templateColumns="repeat(2, 1fr)">
        <GridItem colSpan={3} paddingInline={'1em'} paddingBlock={'.5em'}>
          <Link href={`/chapters/${chapter?.id}`} _hover={{}}>
            <Flex justifyContent={'space-between'}>
              <Heading
                data-cy="chapter-heading"
                fontSize={'xl'}
                fontWeight={700}
                fontFamily={'body'}
                as="h3"
              >
                {chapter?.name}
              </Heading>
              <Text color={'darkcyan'} fontWeight="bold" as="h4">
                {chapter?.category}
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
          <Text mt="2" as="p" fontWeight={400} fontSize={'md'}>
            {chapter?.description}
          </Text>
        </GridItem>
      </Grid>
    </Grid>
  );
};
