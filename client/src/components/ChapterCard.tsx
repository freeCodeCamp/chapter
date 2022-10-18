import { Heading, Grid, Box, Text, Flex } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { ChaptersQuery } from 'generated/graphql';

type ChapterCardProps = {
  chapter: ChaptersQuery['chapters'][number];
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Box
      data-cy="chapter-card"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="full"
      gap={'2'}
      backgroundImage={chapter.banner_url}
      backgroundPosition={'center'}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
    >
      <Grid
        alignItems={'end'}
        height={'25em'}
        maxH={'20%'}
        width={'100%'}
        gap={'3'}
        marginRight={'1em'}
        paddingBlock={'.5em'}
        color={'gray.00'}
        bgGradient="linear(to-b, hsl(240 14% 27% / .6),  hsl(240 14% 10%/ .9), hsl(240 14% 10% ))"
      >
        <Link href={`/chapters/${chapter?.id}`} _hover={{}}>
          <Flex justifyContent={'space-between'}>
            <Heading
              data-cy="chapter-heading"
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
              as="h3"
            >
              {chapter.name}
            </Heading>
            <Text color={'gray-00'} fontWeight="bold" as="h4">
              whatever for now
            </Text>
          </Flex>
        </Link>

        <Text mt="2" as="p" fontWeight={400} fontSize={['sm', 'md', 'lg']}>
          {chapter.description}
        </Text>
      </Grid>
    </Box>
  );
};
