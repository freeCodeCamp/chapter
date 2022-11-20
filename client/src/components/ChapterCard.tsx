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
      backgroundImage={chapter.banner_url ? chapter.banner_url : ''}
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
          ". . ."
          ". . ."
          "chaptername chaptername subnumber"
          "eventheader eventheader aboutheader"
          "event event about"
          "event event about"
          `}
      >
        <GridItem
          paddingInline={'1em'}
          paddingBlock={'.5em'}
          area="chaptername"
        >
          <Link href={`/chapters/${chapter?.id}`} _hover={{}}>
            <Heading
              data-cy="chapter-heading"
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
              as="h3"
            >
              {chapter.name}
            </Heading>
          </Link>
        </GridItem>
        <Text fontWeight="bold" as="h4" gridArea="subnumber">
          Members: {chapter.chapter_users.length}
        </Text>
        <Text
          as="h3"
          fontSize={'md'}
          fontWeight={'500'}
          paddingBlock={'.5em'}
          gridArea="aboutheader"
        >
          About
        </Text>
        <Text
          height="100%"
          noOfLines={4}
          paddingBlock={'.5em'}
          mt="2"
          as="p"
          fontWeight={400}
          fontSize={['sm', 'md', 'lg']}
          gridArea="about"
        >
          {chapter.description}
        </Text>
        <Heading
          as="h3"
          fontSize={'md'}
          fontWeight={'500'}
          paddingInline={'1em'}
          paddingBlock={'.5em'}
          gridArea="eventheader"
        >
          New Events
        </Heading>
        <GridItem area="event">
          {chapter.events.map(({ id, name, canceled, ends_at, start_at }) => (
            <>
              {!canceled && !isPast(new Date(ends_at)) && (
                <Link key={id} href={`/events/${id}`} _hover={{}}>
                  <Flex
                    direction={'column'}
                    paddingLeft={'1em'}
                    paddingBlock={'.5em'}
                    justifyContent={'space-between'}
                  >
                    <Flex justifyContent={'space-between'}>
                      <Text
                        mt="2"
                        fontWeight={600}
                        fontSize={['sm', 'md', 'lg']}
                      >
                        {name}
                      </Text>
                      <Text
                        mt="2"
                        fontWeight={600}
                        fontSize={['sm', 'md', 'lg']}
                        paddingRight=".5em"
                      >
                        {isPast(new Date(start_at)) ? 'Running' : 'Upcomming'}
                      </Text>
                    </Flex>
                  </Flex>
                </Link>
              )}
            </>
          ))}
        </GridItem>
      </Grid>
    </Box>
  );
};
