import {
  Heading,
  Tag,
  Box,
  Flex,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';
import { Chapter, Event, EventTag } from '../generated/graphql';
import { formatDate } from '../util/date';

type EventCardProps = {
  event: Pick<
    Event,
    | 'id'
    | 'name'
    | 'description'
    | 'start_at'
    | 'image_url'
    | 'invite_only'
    | 'canceled'
  > & {
    chapter: Pick<Chapter, 'id' | 'name'>;
    tags?: EventTag[] | null;
  };
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const metaTag = (
    <>
      {event.canceled && (
        <Tag
          borderRadius="lg"
          marginRight={'3'}
          paddingInline="[1 , 2]"
          paddingBlock="[.5, 1]"
          fontSize={['small', 'md']}
          maxWidth={'8em'}
          mt="1"
          maxH={'2em'}
          colorScheme={'red'}
        >
          Canceled
        </Tag>
      )}
      {event.invite_only && (
        <Tag
          borderRadius="lg"
          mt="1"
          paddingInline="[1 , 2]"
          paddingBlock="[.5, 1]"
          colorScheme={'blue'}
          fontSize={['small', 'md']}
          maxWidth={'8em'}
          maxH={'2em'}
        >
          Invite only
        </Tag>
      )}
    </>
  );
  return (
    <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" width={'full'}>
      <Image
        display={['none', 'block']}
        h={'auto'}
        w={'200px'}
        src={event.image_url}
        objectFit={'cover'}
      />
      <Box p="3" py={3} width="full" data-cy="event-card">
        <Grid
          mb="2"
          as="h4"
          lineHeight="tight"
          gridTemplateColumns={'repeat(3, 1fr)'}
          templateAreas={[
            `"eventname eventname eventname"
          "chaptername chaptername chaptername"
          "eventstart eventstart eventstart"
          "metatag metatag metatag"`,
            `"eventname eventname metatag"
          "chaptername chaptername chaptername"
          "eventstart eventstart eventstart"`,
          ]}
        >
          <GridItem area={'eventname'}>
            <Link data-cy="event-link" href={`/events/${event.id}`}>
              <Heading mt={1} size="sm">
                {event.name}
              </Heading>
            </Link>
          </GridItem>
          <GridItem area={'metatag'}>{metaTag}</GridItem>
          <GridItem
            fontSize={'xl'}
            fontWeight={700}
            fontFamily={'body'}
            area={'chaptername'}
            marginBlock={'2'}
          >
            <Link href={`/chapters/${event.chapter.id}`}>
              {event.chapter.name}
            </Link>
          </GridItem>
          <GridItem
            opacity={'.8'}
            area={'eventstart'}
            marginBottom={['1', '2']}
          >
            {formatDate(event.start_at)}
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};
