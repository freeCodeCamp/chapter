import { Heading, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { Loading } from 'components/Loading';
import { ChapterCard } from 'components/ChapterCard';
import { useChaptersQuery } from 'generated/graphql';

export const ChaptersPage: NextPage = () => {
  const { loading, error, data } = useChaptersQuery();

  const isLoading = loading || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

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
