import { LockIcon } from '@chakra-ui/icons';
import {
  Heading,
  VStack,
  Image,
  Text,
  Button,
  useToast,
  List,
  HStack,
  ListItem,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import { Link } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import { LoginRegisterModal } from '../../../components/LoginRegisterModal';
import { useAuth } from '../../auth/store';
import SponsorsCard from '../../../components/SponsorsCard';
import { EVENT } from '../../dashboard/Events/graphql/queries';
import {
  useEventQuery,
  useRsvpToEventMutation,
  useInitUserInterestForChapterMutation,
} from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const EventPage: NextPage = () => {
  const id = useParam('eventId');
  const router = useRouter();
  const { user } = useAuth();

  const [rsvpToEvent] = useRsvpToEventMutation();
  const [initUserInterestForChapter] = useInitUserInterestForChapterMutation();
  const { loading, error, data } = useEventQuery({
    variables: { id: id || -1 },
  });

  const toast = useToast();
  const confirm = useConfirm();
  const modalProps = useDisclosure();

  const handleLoginUserFirst = () => {
    modalProps.onOpen();
  };

  const onRsvp = async (add: boolean) => {
    const ok = await confirm(
      add
        ? { title: 'You want to join this?' }
        : { title: 'Are you sure you want to cancel your RSVP' },
    );

    if (ok) {
      try {
        await rsvpToEvent({
          variables: { eventId: id },
          refetchQueries: [{ query: EVENT, variables: { id } }],
        });

        toast(
          add
            ? {
                title: 'You successfully RSVPed to this event',
                status: 'success',
              }
            : { title: 'You canceled your RSVP 👋', status: 'error' },
        );
        if (add) {
          await initUserInterestForChapter({
            variables: { event_id: id },
          });
        }
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const checkOnRsvp = async (add: boolean) => {
    if (!user) {
      return handleLoginUserFirst();
    }

    await onRsvp(add);
  };
  const userRsvped = useMemo(() => {
    const rsvp = data?.event?.rsvps.find((rsvp) => rsvp.user.id === user?.id);
    if (!rsvp) return null;
    return rsvp.on_waitlist ? 'waitlist' : 'rsvp';
  }, [data?.event]);
  const allDataLoaded = !loading && user;
  const canCheckRsvp = router.query?.emaillink && !userRsvped;
  useEffect(() => {
    if (allDataLoaded) {
      if (canCheckRsvp) {
        checkOnRsvp(true);
      }
      router.replace('/events/' + id, undefined, { shallow: true });
    }
  }, [allDataLoaded, canCheckRsvp]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.event) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  const rsvps = data.event.rsvps.filter((r) => !r.on_waitlist);
  const waitlist = data.event.rsvps.filter((r) => r.on_waitlist);

  return (
    <VStack align="flex-start">
      <LoginRegisterModal
        onRsvp={onRsvp}
        userIds={data?.event?.rsvps.map((r) => r.user.id) || []}
        modalProps={modalProps}
      />
      <Image
        data-cy="event-image"
        boxSize="100%"
        maxH="300px"
        src={data.event.image_url}
        alt=""
        borderRadius="md"
        objectFit="cover"
      />

      <Heading as="h1">
        {data.event.invite_only && <LockIcon />}
        {data.event.name}
      </Heading>
      <Heading size="md">
        Chapter:{' '}
        <Link href={`/chapters/${data.event.chapter.id}`}>
          {data.event.chapter.name}
        </Link>
      </Heading>
      <Text>{data.event.description}</Text>
      <VStack align="start">
        {rsvps && <Heading>RSVPs:{rsvps.length}</Heading>}
        {waitlist && <Heading>Waitlist:{waitlist.length}</Heading>}
      </VStack>
      {userRsvped === 'rsvp' ? (
        <HStack>
          <Heading>You&lsquo;ve RSVPed to this event</Heading>
          <Button colorScheme="red" onClick={() => checkOnRsvp(false)}>
            Cancel
          </Button>
        </HStack>
      ) : userRsvped === 'waitlist' ? (
        <HStack>
          {data.event.invite_only ? (
            <Heading>Event owner will soon confirm your request</Heading>
          ) : (
            <Heading>You&lsquo;re on waitlist for this event</Heading>
          )}
          <Button colorScheme="red" onClick={() => checkOnRsvp(false)}>
            Cancel
          </Button>
        </HStack>
      ) : (
        <Button
          data-cy="rsvp-button"
          colorScheme="blue"
          onClick={() => checkOnRsvp(true)}
        >
          {data.event.invite_only ? 'Request' : 'RSVP'}
        </Button>
      )}

      {data.event.sponsors.length ? (
        <SponsorsCard sponsors={data.event.sponsors} />
      ) : (
        false
      )}
      <Heading data-cy="rsvps-heading" size="md">
        RSVPs:
      </Heading>
      <List>
        {rsvps.map((rsvp) => (
          <ListItem key={rsvp.user.id} mb="2">
            <HStack>
              <Avatar name={rsvp.user.name} />
              <Heading size="md">{rsvp.user.name}</Heading>
            </HStack>
          </ListItem>
        ))}
      </List>

      {!data.event.invite_only && (
        <>
          <Heading data-cy="waitlist-heading" size="md">
            Waitlist:
          </Heading>
          <List>
            {waitlist.map((rsvp) => (
              <ListItem key={rsvp.user.id} mb="2">
                <HStack>
                  <Avatar name={rsvp.user.name} />
                  <Heading size="md">{rsvp.user.name}</Heading>
                </HStack>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </VStack>
  );
};
