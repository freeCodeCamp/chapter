import { LockIcon } from '@chakra-ui/icons';
import {
  Heading,
  Grid,
  Spacer,
  Text,
  Tag,
  GridItem,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { ChaptersQuery } from 'generated/graphql';

type ChapterCardProps = {
  chapter: ChaptersQuery['chapters'][number];
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const metaTag = (
    <>
      {chapter?.events.canceled && (
        <Tag borderRadius="full" pl="2" px="2" colorScheme="red">
          Canceled
        </Tag>
      )}
      {chapter?.events.invite_only && (
        <Tag borderRadius="full" pl="2" px="2" colorScheme="gray">
          <LockIcon />
        </Tag>
      )}
    </>
  );
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
        <GridItem colSpan={3} colStart={1} rowStart={3}>
          <Link href={`/events/${chapter?.events.id}`} _hover={{}}>
            <Flex>
              <Text mt="2">{chapter?.events.name}</Text>
              <Spacer />
              <Text mt="2">{chapter?.events.start_at}</Text>
              <Spacer />
              {metaTag}
            </Flex>
          </Link>
        </GridItem>
      </Grid>
    </Grid>
  );
};
