import { Heading, VStack, Stack } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

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
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={3} mt={10} mb={5}>
          <Heading>Chapters: </Heading>
          <Grid mt="5%" templateColumns="repeat(2, 1fr)" columnGap="5%">
          {data.chapters.map((chapter) => (
            <GridItem>
            <Heading size="md" key={chapter.id}>
              <ChapterCard key={chapter.id} chapter={chapter} />
            </Heading>
            </GridItem>
          ))}   
          </Grid>
      </Stack>
      </Stack>
    </VStack>
  );
};
