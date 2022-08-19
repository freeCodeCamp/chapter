import {
  Heading,
  Grid,
  Spacer,
  Text,
  GridItem,
  Flex,
  Box,
} from '@chakra-ui/react';
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
      <Grid
        w={'100vw'}
        maxW={'35em'}
        templateRows="repeat(2, 5em)"
        templateColumns="repeat(5, 5em)"
      >
        <GridItem colSpan={6} rowEnd={1} padding={'.5em'}>
          <Link href={`/chapters/${chapter?.id}`} _hover={{}}>
            <Flex align="center">
              <Heading
                data-cy="chapter-heading"
                fontSize={'xl'}
                fontWeight={700}
                fontFamily={'body'}
                marginBlock="2"
                as="h3"
              >
                {chapter?.name}
              </Heading>
              <Spacer />
              {/* <Text fontWeight="semibold" as="h4">{chapter?.category}</Text> */}
              <Text color={'darkcyan'} fontWeight="bold" as="h4">
                In-Person
              </Text>
            </Flex>
          </Link>
        </GridItem>
        <GridItem
          rowSpan={2}
          colSpan={2}
          rowStart={1}
          colStart={1}
          marginLeft={'0.5em'}
        >
          <Text mt="2" as="p">
            {chapter?.description}
          </Text>
        </GridItem>
        <Box>
          {chapter.events.forEach((_, index) => (
            <GridItem colSpan={3} colStart={1} rowStart={2}>
              <Link href={`/events/${chapter?.events[index].id}`} _hover={{}}>
                <Flex>
                  <Text mt="2">{chapter?.events[index].name}</Text>
                  <Spacer />
                  <Text mt="2">{chapter?.events[index].start_at}</Text>
                </Flex>
              </Link>
            </GridItem>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};
