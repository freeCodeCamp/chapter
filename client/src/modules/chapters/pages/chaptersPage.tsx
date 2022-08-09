import { Heading, VStack, Stack, Flex, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';

import { ChapterCard } from 'components/ChapterCard';
import { useChaptersQuery } from 'generated/graphql';

export const ChaptersPage: NextPage = () => {
  const { loading, error, data } = useChaptersQuery();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.chapters) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <VStack>
      <Stack spacing={3} mt={10} mb={5}>
        <Flex justify="start">
          <Heading>Chapters: </Heading>
        </Flex>
        <Flex direction="column">
          <Text fontSize="2xl">
            {' '}
            Chapters allow you to organize events based on your preferences.
          </Text>
          <Flex wrap="wrap" justify="space-evenly">
            {data.chapters.map((chapter) => (
              <Heading size="md" key={chapter.id} mt={10} mr={10}>
                <ChapterCard key={chapter.id} chapter={chapter} />
              </Heading>
            ))}
          </Flex>
        </Flex>
      </Stack>
    </VStack>
  );
};
