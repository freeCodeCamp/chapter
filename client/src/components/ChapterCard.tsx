import { Heading, Grid, Text, GridItem, Flex, Box } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { isPast } from 'date-fns';
import { ChapterCardRelations } from 'generated/graphql';

type ChapterCardProps = {
  chapter: ChapterCardRelations;
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
        templateColumns="repeat(2, 1fr)"
        gap={'3'}
        width="100%"
        marginRight={'1em'}
        paddingBlock={'.5em'}
        color={'gray.00'}
        bgGradient="linear(to-b,hsl(240 14% 27% / .8),  hsl(240 14% 10%/ .9), hsl(240 14% 10%))"
      >
        <GridItem paddingInline={'1em'} paddingBlock={'.5em'} colSpan={3}>
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
              <Text fontWeight="bold" as="h4">
                Members: {chapter.chapter_users.length}
              </Text>
            </Flex>
          </Link>
        </GridItem>
        <GridItem
          colStart={1}
          colSpan={2}
          marginInline={'1em'}
          marginBlock={'.5em'}
        >
          <Text mt="2" as="p" fontWeight={400} fontSize={['sm', 'md', 'lg']}>
            {chapter.description}
          </Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Heading
            as="h3"
            fontSize={'md'}
            fontWeight={'500'}
            paddingInline={'1em'}
            paddingBlock={'.5em'}
          >
            New Events
          </Heading>
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
