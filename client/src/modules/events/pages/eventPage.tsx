import { LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { NextPage } from 'next';
import NextError from 'next/error';
import React from 'react';

import { Loading } from '../../../components/Loading';
import SponsorsCard from '../../../components/SponsorsCard';
import { TagsBox } from '../../../components/TagsBox';
import { useEventQuery } from '../../../generated/graphql';
import { formatDate } from '../../../util/date';
import { useParam } from '../../../hooks/useParam';
import { AttendanceNames } from '../../../../../common/attendance';
import { UsersList } from '../components/UsersList';
import { Actions } from '../components/Actions';

const textStyleProps = { fontWeight: 500, fontSize: ['smaller', 'sm', 'md'] };

export const EventPage: NextPage = () => {
  const { param: eventId } = useParam('eventId');

  const { loading, error, data } = useEventQuery({
    variables: { eventId },
  });

  if (error || loading) return <Loading error={error} />;
  if (!data?.event)
    return <NextError statusCode={404} title="Event not found" />;

  const attendees = data.event.event_users.filter(
    ({ attendance }) => attendance.name === AttendanceNames.confirmed,
  );
  const waitlist = data.event.event_users.filter(
    ({ attendance }) => attendance.name === AttendanceNames.waitlist,
  );

  const startAt = formatDate(data.event.start_at);
  const endsAt = formatDate(data.event.ends_at);

  return (
    <>
      <VStack align="flex-start">
        {data.event.image_url && (
          <Box height={'300px'}>
            <Image
              data-cy="event-image"
              boxSize="100%"
              maxH="300px"
              src={data.event.image_url}
              alt=""
              borderRadius="md"
              objectFit="cover"
              fallbackSrc="https://cdn.freecodecamp.org/chapter/brown-curtain-small.jpg"
              fallbackStrategy="onError"
            />
          </Box>
        )}
        <Flex alignItems={'center'}>
          {data.event.invite_only && (
            <Tooltip label="Invite only">
              <LockIcon fontSize={'2xl'} />
            </Tooltip>
          )}
          <Heading as="h1">{data.event.name}</Heading>
        </Flex>
        {data.event.canceled && (
          <Text {...textStyleProps} fontSize="md" color="red.500">
            Canceled
          </Text>
        )}
        {!!data.event.event_tags.length && (
          <TagsBox tags={data.event.event_tags} />
        )}
        <Text {...textStyleProps} fontSize={['md', 'lg', 'xl']}>
          Chapter:{' '}
          <Link href={`/chapters/${data.event.chapter.id}`}>
            {data.event.chapter.name}
          </Link>
        </Text>
        <Text {...textStyleProps}>{data.event.description}</Text>
        <Text {...textStyleProps}>Starting: {startAt}</Text>
        <Text {...textStyleProps}>Ending: {endsAt}</Text>
        <Text {...textStyleProps}>Capacity: {data.event.capacity}</Text>
        {data.event.url && (
          <Text {...textStyleProps}>
            More about event:{' '}
            <ChakraLink href={data.event.url} isExternal>
              {data.event.url}
            </ChakraLink>
          </Text>
        )}
        <Actions event={data.event} />

        {data.event.sponsors.length && (
          <SponsorsCard sponsors={data.event.sponsors} />
        )}
        <UsersList text="Attendees" users={attendees} />
        {!data.event.invite_only && (
          <UsersList text="Waitlist" users={waitlist} />
        )}
      </VStack>
    </>
  );
};
