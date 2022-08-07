import { Stack, Heading, Box, Grid, Image, Text, Tag } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { Chapter } from 'generated/graphql';

type ChapterCardProps = {
  chapter: Pick<
    Chapter,
    'id' | 'name' | 'description' | 'category' | 'imageUrl'
  >;
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Grid gridGap={2} data-cy="chapter-card">
      <Link href={`/chapters/${chapter.id}`} _hover={{}}>
        <Grid
          gridGap={2}
          w={'100vw'}
          maxW={'40em'}
          templateColumns="repeat(2, 1fr)"
          boxShadow="outline"
        >
          <Box>
            <Stack spacing={0} boxShadow="outline">
              <Heading
                data-cy="chapter-heading"
                fontSize={'xl'}
                fontWeight={500}
                fontFamily={'body'}
                color={'white'}
                textShadow={'1px 1px #000'}
              >
                {chapter.name}
              </Heading>
              <Text color={'white'} textShadow={'1px 1px #000'}>
                {chapter.category}
              </Text>
              <Tag>Random Tag</Tag>
            </Stack>
          </Box>
          <Image
            boxSize={'100px'}
            src={chapter.imageUrl}
            objectFit={'cover'}
            display="block"
          />
          <Text boxShadow="dark-lg">{chapter.description}</Text>
        </Grid>
      </Link>
    </Grid>
  );
};
