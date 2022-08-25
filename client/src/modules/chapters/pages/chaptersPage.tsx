import { Heading, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
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
    <Stack mt={10} mb={5} display={'block'}>
      <Heading>Chapters: </Heading>
      <Grid templateColumns="[repeat(2, 1fr), none]" gap="1em">
        {data.chapters.map((chapter) => (
          <GridItem key={chapter.id}>
            <Heading size="md">
              <ChapterCard chapter={chapter} />
            </Heading>
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
