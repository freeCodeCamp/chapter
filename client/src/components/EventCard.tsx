import { LockIcon } from '@chakra-ui/icons';
import { Heading, Text, Tag, Box, Flex, Image, Spacer } from '@chakra-ui/react';
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
  const metaTag = event.canceled ? (
    <Tag borderRadius="full" pl="2" px="2" colorScheme="red">
      Cancelled
    </Tag>
  ) : event.invite_only ? (
    <Tag borderRadius="full" pl="2" px="2" colorScheme="gray">
      <LockIcon />
    </Tag>
  ) : (
    ''
  );
  return (
    <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" width={'full'}>
      <Image h={'auto'} w={'200px'} src={event.image_url} objectFit={'cover'} />
      <Box p="3" py={3} width="full" data-cy="event-card">
        <Flex
          mb="2"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {formatDate(event.start_at)}
          <Spacer />
          {metaTag}
        </Flex>
        <Box>
          {event.invite_only && <LockIcon />}{' '}
          <Link data-cy="event-link" href={`/events/${event.id}`}>
            <Heading size="sm">{event.name}</Heading>
          </Link>
          {event.canceled && (
            <Text as="span" color="red.500" ml="2">
              Canceled
            </Text>
          )}
        </Box>
        <Box>
          <Link href={`/chapters/${event.chapter.id}`}>
            {event.chapter.name}
          </Link>
        </Box>
        {event.tags && (
          <Box d="flex" alignItems="baseline" pt={3}>
            {event.tags.map(({ tag }) => (
              <Tag
                borderRadius="full"
                pl="2"
                px="2"
                colorScheme="teal"
                key={tag.name}
                mr="2"
              >
                {tag.name}
              </Tag>
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
};
