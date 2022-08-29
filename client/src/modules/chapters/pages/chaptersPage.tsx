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
      <Heading marginBlock={'1em'}>Chapters: </Heading>
      <Grid gap="1em" width={'80vw'} marginBlock={0}>
        {data.chapters.map((chapter) => (
          <GridItem key={chapter.id}>
            <ChapterCard chapter={chapter} />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
