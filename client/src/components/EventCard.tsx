import { Heading, Tag, Box, Flex, Image, Grid } from '@chakra-ui/react';
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
          borderRadius="md"
          marginRight={'3'}
          pl="2"
          px="2"
          colorScheme="gray"
          fontSize={['small', 'md']}
          maxWidth={'8em'}
          maxH={'2em'}
        >
          Canceled
        </Tag>
      )}
      {event.invite_only && (
        <Tag
          borderRadius="md"
          pl="2"
          px="2"
          colorScheme="gray"
          fontSize={['small', 'md']}
          maxWidth={'8em'}
          maxH={'2em'}
        >
          Invite Only
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
        <Grid mb="2" as="h4" lineHeight="tight">
          <Box>
            <Link data-cy="event-link" href={`/events/${event.id}`}>
              <Heading size="sm">{event.name}</Heading>
            </Link>
          </Box>
          <Box>{metaTag}</Box>
          <Box>
            <Link
              href={`/chapters/${event.chapter.id}`}
              fontSize={'xl'}
              fontWeight={700}
              fontFamily={'body'}
            >
              {event.chapter.name}
            </Link>
          </Box>
          <Box>{formatDate(event.start_at)}</Box>
        </Grid>
      </Box>
    </Flex>
  );
};
