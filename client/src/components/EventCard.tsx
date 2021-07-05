import { LockIcon } from '@chakra-ui/icons';
import { Heading, Text, Tag, Box, Flex, Image } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import React from 'react';
import { Chapter, Event, Tag as DBTag } from '../generated/graphql';
import { formatDate } from '../helpers/date';

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
    tags?: Pick<DBTag, 'name'>[] | null;
  };
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  console.log(event);
  return (
    <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" width={'full'}>
      <Image h={'auto'} w={'200px'} src={event.image_url} objectFit={'cover'} />

      <Box p="3" py={3} data-cy="event-card">
        <Box
          mb="2"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {formatDate(event.start_at)}
        </Box>
        <Box>
          {event.invite_only && <LockIcon />}{' '}
          <Link data-cy="event-link" href={`/events/${event.id}`}>
            <Heading size="sm"> {event.name}</Heading>
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
        <Box d="flex" alignItems="baseline" pt={3}>
          {event.tags?.map((t) => (
            <Tag
              borderRadius="full"
              pl="2"
              px="2"
              colorScheme="teal"
              key={t.name}
              mr="2"
            >
              {t.name}
            </Tag>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};
