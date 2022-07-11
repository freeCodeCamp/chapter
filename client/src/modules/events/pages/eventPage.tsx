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
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
  useInitUserInterestForChapterMutation,
} from '../../../generated/graphql';
import { useParam } from 'hooks/useParam';

export const EventPage: NextPage = () => {
  const eventId = useParam('eventId');
  const router = useRouter();
  const { user } = useAuth();

  const refetch = {
    refetchQueries: [{ query: EVENT, variables: { eventId } }],
  };

  const [rsvpToEvent] = useRsvpToEventMutation(refetch);
  const [initUserInterestForChapter] = useInitUserInterestForChapterMutation();
  const [subscribeToEvent] = useSubscribeToEventMutation(refetch);
  const [unsubscribeFromEvent] = useUnsubscribeFromEventMutation(refetch);
  // TODO: check if we need to default to -1 here
  const { loading, error, data } = useEventQuery({
    variables: { eventId },
  });

  const toast = useToast();
  const confirm = useConfirm();
  const modalProps = useDisclosure();

  const eventUser = useMemo(() => {
    const eUser = data?.event?.event_users.find(
      ({ user: event_user }) => event_user.id === user?.id,
    );
    if (!eUser) return null;
    return eUser;
  }, [data?.event]);
  const userRsvped =
    eventUser?.rsvp.name !== 'no' ? eventUser?.rsvp.name : null;
  const allDataLoaded = !loading && user;
  const canCheckRsvp = router.query?.emaillink && !userRsvped;
  useEffect(() => {
    if (allDataLoaded && canCheckRsvp) checkOnRsvp(true);
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

  const chapterId = data.event.chapter.id;

  const handleLoginUserFirst = () => {
    modalProps.onOpen();
  };

  const onSubscribeToEvent = async () => {
    const ok = await confirm({ title: 'Do you want to subscribe?' });
    if (ok) {
      try {
        await subscribeToEvent({ variables: { eventId } });
        toast({
          title: 'You successfully subscribed to this event',
          status: 'success',
        });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const onUnsubscribeFromEvent = async () => {
    const ok = await confirm({
      title: 'Unsubscribe from event?',
      body: 'After unsubscribing you will not receive any communication regarding this event, including reminder before the event.',
    });
    if (ok) {
      try {
        await unsubscribeFromEvent({ variables: { eventId } });
        toast({
          title: 'You have unsubscribed from this event',
          status: 'info',
        });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const onRsvp = async (add: boolean) => {
    const ok = await confirm(
      add
        ? { title: 'You want to join this?' }
        : { title: 'Are you sure you want to cancel your RSVP' },
    );

    if (ok) {
      try {
        // this has to happen before trying to RSVP, since the user needs to be
        // added to the chapter first.
        if (add) {
          await initUserInterestForChapter({
            variables: { eventId },
          });
        }
        await rsvpToEvent({
          variables: { eventId, chapterId },
        });

        toast(
          add
            ? {
                title: 'You successfully RSVPed to this event',
                status: 'success',
              }
            : { title: 'You canceled your RSVP 👋', status: 'error' },
        );
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

  const rsvps = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'yes',
  );
  const waitlist = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'waitlist',
  );

  return (
    <VStack align="flex-start">
      <LoginRegisterModal
        onRsvp={onRsvp}
        userIds={data?.event?.event_users.map(({ user }) => user.id) || []}
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
        <Link href={`/chapters/${chapterId}`}>{data.event.chapter.name}</Link>
      </Heading>
      <Text>{data.event.description}</Text>
      <VStack align="start">
        {rsvps && <Heading>RSVPs:{rsvps.length}</Heading>}
        {waitlist && <Heading>Waitlist:{waitlist.length}</Heading>}
      </VStack>
      {userRsvped === 'yes' ? (
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
      {eventUser && (
        <HStack>
          {eventUser.subscribed ? (
            <>
              <Heading>You are subscribed</Heading>
              <Button colorScheme="orange" onClick={onUnsubscribeFromEvent}>
                Unsubscribe
              </Button>
            </>
          ) : (
            <>
              <Heading>Not subscribed</Heading>
              <Button colorScheme="blue" onClick={onSubscribeToEvent}>
                Subscribe
              </Button>
            </>
          )}
        </HStack>
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
        {rsvps.map(({ user }) => (
          <ListItem key={user.id} mb="2">
            <HStack>
              <Avatar name={user.name} />
              <Heading size="md">{user.name}</Heading>
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
            {waitlist.map(({ user }) => (
              <ListItem key={user.id} mb="2">
                <HStack>
                  <Avatar name={user.name} />
                  <Heading size="md">{user.name}</Heading>
                </HStack>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </VStack>
  );
};
