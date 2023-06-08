import { LockIcon } from '@chakra-ui/icons';
import { Tag, Box, Flex, Image, Grid, GridItem, Text } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { isPast } from 'date-fns';
import React from 'react';
import { Chapter, EventWithVenue } from '../generated/graphql';
import { formatDate } from '../util/date';
import { TagsBox } from './TagsBox';

type EventCardProps = {
  event: Pick<
    EventWithVenue,
    | 'id'
    | 'name'
    | 'description'
    | 'start_at'
    | 'ends_at'
    | 'image_url'
    | 'invite_only'
    | 'canceled'
    | 'event_tags'
  > & {
    chapter: Pick<Chapter, 'id' | 'name'>;
  };
};

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

const InviteOnly = () => (
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
    <LockIcon marginRight=".25rem" />
    Invite only
  </Tag>
);

export const EventCard = ({ event }: EventCardProps) => {
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
      position="relative"
    >
      <Box w="240px" h="120px" display={['none', 'block']} background="gray.85">
        <Image
          width="100%"
          height="100%"
          src={
            event.image_url ||
            'https://cdn.freecodecamp.org/chapter/brown-curtain-small.jpg'
          }
          fit="cover"
          fallbackSrc="https://cdn.freecodecamp.org/chapter/brown-curtain-small.jpg"
          fallbackStrategy="onError"
        />
      </Box>
      <Box p="3" py={3} width="full" data-cy="event-card">
        <Grid
          mb="2"
          gridTemplateColumns={'repeat(3, 1fr)'}
          templateAreas={`
          "eventname eventname eventname"
          "chaptername chaptername chaptername"
          "eventstart eventstart eventstart"
          "InviteOnly InviteOnly InviteOnly"
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
            _before={{
              content: '""',
              position: 'absolute',
              inset: '0',
              zIndex: '1',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {event.name}
          </Link>
          {event.invite_only && (
            <GridItem area={'InviteOnly'}>
              <InviteOnly />
            </GridItem>
          )}
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
        {!!event.event_tags.length && <TagsBox tags={event.event_tags} />}
      </Box>
    </Flex>
  );
};
