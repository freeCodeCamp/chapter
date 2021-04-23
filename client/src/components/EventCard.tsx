import React from 'react';
import Link from 'next/link';
import { Heading, Text, Tag, HStack, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Chapter, Event, Tag as DBTag } from 'generated/graphql';
import { Card } from './Card';

type EventCardProps = {
  event: Pick<Event, 'id' | 'name' | 'description' | 'start_at'> & {
    chapter: Pick<Chapter, 'id' | 'name'>;
    tags?: Pick<DBTag, 'name'>[] | null;
  };
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card w="50%">
      <Flex justify="space-between">
        <Heading size="md" as="h2">
          <Link href={`/events/${event.id}`} passHref>
            <a>{event.name}</a>
          </Link>
        </Heading>
        <HStack>
          {event.tags?.map((t) => (
            <Tag key={t.name}>{t.name}</Tag>
          ))}
        </HStack>
      </Flex>

      <Heading size="sm">
        {format(new Date(event.start_at), 'E, LLL d @ HH:MM')}
      </Heading>
      <Link href={`/chapters/${event.chapter.id}`}>{event.chapter.name}</Link>

      <Text>{event.description}</Text>
    </Card>
  );
};
