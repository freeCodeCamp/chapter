import {
  Grid,
  Text,
  GridItem,
  Flex,
  Box,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';

import { isPast } from 'date-fns';
import { LockIcon } from '@chakra-ui/icons';
import { ChaptersQuery } from '../generated/graphql';
import { TagsBox } from './TagsBox';

type ChapterCardProps = {
  chapter: ChaptersQuery['chapters'][number];
};

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <>
      {chapter.logo_url && (
        <Image
          src={chapter.logo_url}
          alt={`${chapter.name} logo`}
          position="relative"
          top="2.75em"
          left="2em"
          width="4.5em"
          height="4.5em"
          borderRadius="50%"
          outline="2px solid white"
        />
      )}
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
          bgImage="linear-gradient(to bottom,hsl(240 14% 27%/ .9),  hsl(240 14% 10%/ .9), hsl(240 14% 10%))"
          alignItems="center"
          templateAreas={`
          ". . ."
          ". . ."
          "chaptername chaptername subnumber"
          "tags tags tags"
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
            <Link
              fontSize={['lg', 'xl', '2xl']}
              fontWeight={700}
              fontFamily={'body'}
              paddingInline=".1em"
              href={`/chapters/${chapter.id}`}
              data-cy="chaptercard-name"
            >
              {chapter.name}
            </Link>
          </GridItem>
          <GridItem
            display="inline-grid"
            width="100%"
            justifyItems="flex-end"
            gridArea="subnumber"
            paddingInline="1.5em"
          >
            <Text fontWeight="bold">
              Members: {chapter._count.chapter_users}
            </Text>
          </GridItem>
          {!!chapter.chapter_tags.length && (
            <GridItem gridArea="tags" paddingInline="1em">
              <TagsBox tags={chapter.chapter_tags} colorScheme="gray" />
            </GridItem>
          )}
          <Text
            paddingInline={'1em'}
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
          <Text
            fontSize={['md', 'lg', 'xl']}
            fontWeight={'500'}
            paddingInline={'1em'}
            marginBlockStart={'.5em'}
            gridArea="eventheader"
          >
            Next Events
          </Text>
          <GridItem area="event" paddingInline={'1em'}>
            {chapter.events
              .filter(({ ends_at }) => !isPast(new Date(ends_at)))
              .map(({ id, name, start_at, invite_only }) => (
                <Flex
                  paddingBlock={'.5em'}
                  paddingInline={'.3em'}
                  justifyContent={'space-between'}
                  alignItems="center"
                  key={id}
                >
                  <Link
                    href={`/events/${id}`}
                    mt="2"
                    fontWeight={600}
                    fontSize={['sm', 'md', 'lg']}
                  >
                    {name}
                  </Link>
                  {invite_only && (
                    <Tooltip label="Invite only">
                      <LockIcon
                        mt="2"
                        marginLeft="auto"
                        marginRight="1"
                        fontSize={['sm', 'md', 'lg']}
                      />
                    </Tooltip>
                  )}
                  <Text mt="2" fontWeight={600} fontSize={['sm', 'md', 'lg']}>
                    {isPast(new Date(start_at)) ? 'Running' : 'Upcoming'}
                  </Text>
                </Flex>
              ))}
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
