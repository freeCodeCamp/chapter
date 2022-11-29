import { Heading, Grid, Text, GridItem, Flex, Box } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { isPast } from 'date-fns';
import { ChaptersQuery } from '../generated/graphql';

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
      width={'full'}
      minW={'20em'}
      gap={'2'}
      backgroundImage={
        chapter.banner_url ??
        'https://cdn.freecodecamp.org/chapter/orange-graphics-small.jpg'
      }
      backgroundPosition={'center'}
      backgroundRepeat={'no-repeat'}
      backgroundSize={'cover'}
    >
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={'3'}
        width="100%"
        marginRight={'1em'}
        paddingBlock={'.5em'}
        color={'gray.00'}
        bgGradient="linear(to-b,hsl(240 14% 27%/ .9),  hsl(240 14% 10%/ .9), hsl(240 14% 10%))"
        alignItems="center"
        templateAreas={`
          ". . ."
          ". . ."
          "chaptername chaptername subnumber"
          "aboutheader aboutheader aboutheader"
          "about about about"
          "eventheader eventheader eventheader"
          "event event event"
          "event event event"
          `}
      >
        <GridItem
          paddingInline={'1em'}
          paddingBlock={'.5em'}
          area="chaptername"
        >
          <Link href={`/chapters/${chapter.id}`} _hover={{}}>
            <Heading
              data-cy="chapter-heading"
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
              paddingInline=".1em"
              as="h3"
            >
              {chapter.name}
            </Heading>
          </Link>
        </GridItem>
        <GridItem
          display="inline-grid"
          width="100%"
          justifyItems="flex-end"
          gridArea="subnumber"
          paddingInline="1.5em"
        >
          <Text fontWeight="bold" as="h4">
            Members: {chapter.chapter_users.length}
          </Text>
        </GridItem>
        <Text
          paddingInline={'1em'}
          as="h3"
          fontSize={['md', 'lg', 'xl']}
          fontWeight={'500'}
          gridArea="aboutheader"
        >
          About
        </Text>
        <Text
          noOfLines={3}
          paddingInline={'1em'}
          fontWeight={400}
          fontSize={['sm', 'md', 'lg']}
          gridArea="about"
        >
          {chapter.description}
        </Text>
        <Heading
          as="h3"
          fontSize={['md', 'lg', 'xl']}
          fontWeight={'500'}
          paddingInline={'1em'}
          marginBlockStart={'.5em'}
          gridArea="eventheader"
        >
          New Events
        </Heading>
        <GridItem area="event" paddingInline={'1em'}>
          {chapter.events.map(({ id, name, start_at }) => (
              <Link key={id} href={`/events/${id}`}>
                <Flex
                  paddingBlock={'.5em'}
                  paddingInline={'.3em'}
                  justifyContent={'space-between'}
                >
                  <Text fontWeight={'500'} fontSize={['sm', 'md', 'lg']}>
                    {name}
                  </Text>
                  <Text fontWeight={600} fontSize={['sm', 'md', 'lg']}>
                    {isPast(new Date(start_at)) ? 'Running' : 'Upcoming'}
                  </Text>
                </Flex>
              </Link>
          ))}
        </GridItem>
      </Grid>
    </Box>
  );
};
