import { Tag, Box, Flex, Image, Grid, GridItem, Text } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { isPast } from 'date-fns';
import React from 'react';
import { Chapter, Event } from '../generated/graphql';
import { formatDate } from '../util/date';

type EventCardProps = {
  event: Pick<
    Event,
    | 'id'
    | 'name'
    | 'description'
    | 'start_at'
    | 'ends_at'
    | 'image_url'
    | 'invite_only'
    | 'canceled'
  > & {
    chapter: Pick<Chapter, 'id' | 'name'>;
  };
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const metaTag = (
    <>
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
  enum EventStatus {
    canceled = 'Canceled',
    running = 'Running',
    ended = 'Ended',
    upcoming = 'Upcoming',
  }

  const statusToStyle = {
    [EventStatus.canceled]: { 'data-cy': 'event-canceled', color: 'red.500' },
    [EventStatus.running]: {
      color: 'gray.00',
      backgroundColor: 'gray.45',
      paddingInline: '.3em',
      borderRadius: 'sm',
    },
    [EventStatus.ended]: { color: 'gray.45', fontWeight: '400' },
    [EventStatus.upcoming]: {},
  };

  const hasEnded = isPast(new Date(event.ends_at));
  const getEventStatus = ({
    canceled,
    hasStarted,
    hasEnded,
  }: {
    canceled: boolean;
    hasStarted: boolean;
    hasEnded: boolean;
  }) => {
    if (canceled) return EventStatus.canceled;
    if (hasEnded) return EventStatus.ended;
    if (hasStarted) return EventStatus.running;
    return EventStatus.upcoming;
  };
  const eventStatus = getEventStatus({
    canceled: event.canceled,
    hasStarted: isPast(new Date(event.start_at)),
    hasEnded,
  });
  const eventStatusStyle = statusToStyle[eventStatus];
  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width={'full'}
      {...(hasEnded && { opacity: 0.6 })}
    >
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
          lineHeight="tight"
          gridTemplateColumns={'repeat(3, 1fr)'}
          templateAreas={`
          "eventname eventname eventname"
          "chaptername chaptername chaptername"
          "eventstart eventstart eventstart"
          "metatag metatag metatag"
          `}
        >
          <Link
            data-cy="event-link"
            mt={1}
            size="sm"
            gridArea={'eventname'}
            fontSize={'xl'}
            fontWeight={700}
            href={`/events/${event.id}`}
          >
            {event.name}
          </Link>
          <GridItem area={'metatag'}>{metaTag}</GridItem>
          <Text
            opacity={'.8'}
            gridArea={'eventstart'}
            marginBottom={['1', '2']}
            {...eventStatusStyle}
            fontSize={['smaller', 'sm']}
            fontWeight={'semibold'}
          >
            {eventStatus}: {formatDate(event.start_at)}
          </Text>
        </Grid>
      </Box>
    </Flex>
  );
};
