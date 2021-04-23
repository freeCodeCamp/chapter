import React from 'react';
import { NextPage } from 'next';
import { useChaptersQuery } from 'generated/graphql';
import { Heading, VStack } from '@chakra-ui/layout';
import { Link } from 'chakra-next-link';

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
      <Heading>Chapters: </Heading>

      {data.chapters.map((chapter) => (
        <Heading size="md" key={chapter.id}>
          <Link href={`/chapters/${chapter.id}`}>{chapter.name}</Link>
        </Heading>
      ))}
    </VStack>
  );
};
