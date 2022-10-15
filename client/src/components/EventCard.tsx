import {
  Heading,
  Tag,
  Box,
  Flex,
  Image,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
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
  const eventStatus = event.canceled
    ? 'Canceled'
    : new Date(event.start_at) < new Date()
    ? 'Passed'
    : 'Upcoming';
  const canceledStyle = { 'data-cy': 'event-canceled', color: 'red.500' };
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
          templateAreas={`
          "eventname eventname eventname"
          "chaptername chaptername chaptername"
          "eventstart eventstart eventstart"
          "metatag metatag metatag"
          `}
        >
          <GridItem area={'eventname'}>
            <Link data-cy="event-link" href={`/events/${event.id}`}>
              <Heading
                mt={1}
                size="sm"
                as={'h3'}
                fontSize={'xl'}
                fontWeight={700}
              >
                {event.name}
              </Heading>
            </Link>
          </GridItem>
          <GridItem area={'metatag'}>{metaTag}</GridItem>
          <GridItem
            fontSize={'md'}
            fontWeight={500}
            fontFamily={'body'}
            area={'chaptername'}
            marginBlock={'2'}
            as={'p'}
          >
            <Link href={`/chapters/${event.chapter.id}`}>
              Chapter: {event.chapter.name}
            </Link>
          </GridItem>
          <GridItem
            opacity={'.8'}
            area={'eventstart'}
            marginBottom={['1', '2']}
          >
            <Text
              {...(event.canceled && canceledStyle)}
              fontSize={['smaller', 'sm']}
              fontWeight={'semibold'}
            >
              {eventStatus}: {formatDate(event.start_at)}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};
