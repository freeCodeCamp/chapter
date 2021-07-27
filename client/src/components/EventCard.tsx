import React from 'react';
import { Heading, Text, Tag, HStack, Flex } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { Link } from 'chakra-next-link';
import { Chapter, Event, Tag as DBTag } from '../generated/graphql';
import { Card } from './Card';
import { truncate } from '../helpers/truncate';
import { formatDate } from '../helpers/date';

type EventCardProps = {
  event: Pick<
    Event,
    'id' | 'name' | 'description' | 'start_at' | 'invite_only' | 'canceled'
  > & {
    chapter: Pick<Chapter, 'id' | 'name'>;
    tags?: Pick<DBTag, 'name'>[] | null;
  };
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card w="full" data-cy="event card">
      <Flex justify="space-between">
        <Heading size="md" as="h2">
          {event.invite_only && <LockIcon />}{' '}
          <Link href={`/events/${event.id}`}>{event.name}</Link>
          {event.canceled && (
            <Text as="span" color="red.500" ml="2">
              Canceled
            </Text>
          )}
        </Heading>
        <HStack>
          {event.tags?.map((t) => (
            <Tag key={t.name}>{t.name}</Tag>
          ))}
        </HStack>
      </Flex>

      <Heading size="sm">{formatDate(event.start_at)}</Heading>
      <Link href={`/chapters/${event.chapter.id}`}>{event.chapter.name}</Link>

      <Text>{truncate(event.description, 120)}</Text>
    </Card>
  );
};
