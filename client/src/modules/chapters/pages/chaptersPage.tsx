import React from 'react';
import { NextPage } from 'next';
import { useChaptersQuery } from 'generated/graphql';
import { Heading, VStack, Stack } from '@chakra-ui/layout';
import { ChapterCard } from 'components/ChapterCard';

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
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Heading>Chapters: </Heading>
        {data.chapters.map((chapter) => (
          <Heading size="md" key={chapter.id}>
            <ChapterCard key={chapter.id} chapter={chapter} />
          </Heading>
        ))}
      </Stack>
    </VStack>
  );
};
