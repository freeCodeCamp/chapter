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
  Flex,
} from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import { Link } from 'chakra-next-link';
import { NextPage } from 'next';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import { useAuth } from '../../auth/store';
import { Loading } from '../../../components/Loading';
import SponsorsCard from '../../../components/SponsorsCard';
import { EVENT } from '../graphql/queries';
import { DASHBOARD_EVENT } from '../../dashboard/Events/graphql/queries';
import {
  useCancelRsvpMutation,
  useEventLazyQuery,
  useJoinChapterMutation,
  useRsvpToEventMutation,
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
} from '../../../generated/graphql';
import { useParam } from 'hooks/useParam';
import { useLogin } from 'hooks/useAuth';

export const EventPage: NextPage = () => {
  const { param: eventId, isReady } = useParam('eventId');
  const router = useRouter();
  const { user } = useAuth();
  const login = useLogin();

  const refetch = {
    refetchQueries: [
      { query: EVENT, variables: { eventId } },
      { query: DASHBOARD_EVENT, variables: { eventId } },
    ],
  };

  const [rsvpToEvent] = useRsvpToEventMutation(refetch);
  const [cancelRsvp] = useCancelRsvpMutation(refetch);
  const [joinChapter] = useJoinChapterMutation(refetch);
  const [subscribeToEvent] = useSubscribeToEventMutation(refetch);
  const [unsubscribeFromEvent] = useUnsubscribeFromEventMutation(refetch);

  const [getEvent, { loading, error, data }] = useEventLazyQuery({
    variables: { eventId },
  });

  useEffect(() => {
    if (isReady) getEvent();
  }, [isReady]);

  const toast = useToast();
  const confirm = useConfirm();

  const eventUser = useMemo(() => {
    return data?.event?.event_users.find(
      ({ user: event_user }) => event_user.id === user?.id,
    );
  }, [data?.event]);
  const rsvpStatus =
    eventUser?.rsvp.name !== 'no' ? eventUser?.rsvp.name : null;
  const allDataLoaded = !loading && user;
  const canCheckRsvp = router.query?.emaillink && !rsvpStatus;
  useEffect(() => {
    if (allDataLoaded && canCheckRsvp) checkOnRsvp();
  }, [allDataLoaded, canCheckRsvp]);

  const isLoading = loading || !isReady || !data;

  if (isLoading || error) return <Loading loading={isLoading} error={error} />;
  if (!data.event)
    return <NextError statusCode={404} title="Event not found" />;

  const chapterId = data.event.chapter.id;

  async function onSubscribeToEvent() {
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
  }

  async function onUnsubscribeFromEvent() {
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
  }

  async function onRsvp() {
    const ok = await confirm({ title: 'You want to join this?' });

    if (ok) {
      try {
        await joinChapter({ variables: { chapterId } });
        await rsvpToEvent({
          variables: { eventId, chapterId },
        });

        toast({
          title: 'You successfully RSVPed to this event',
          status: 'success',
        });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  }

  async function onCancelRsvp() {
    const ok = await confirm({
      title: 'Are you sure you want to cancel your RSVP?',
    });

    if (ok) {
      try {
        await cancelRsvp({
          variables: { eventId },
        });

        toast({ title: 'You canceled your RSVP 👋', status: 'info' });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  }

  // TODO: reimplment this the login modal with Auth0
  async function checkOnRsvp() {
    if (!user) await login();
    await onRsvp();
  }

  const rsvps = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'yes',
  );
  const waitlist = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'waitlist',
  );

  return (
    <VStack align="flex-start">
      <Image
        data-cy="event-image"
        boxSize="100%"
        maxH="300px"
        src={data.event.image_url}
        alt=""
        borderRadius="md"
        objectFit="cover"
      />
      <Flex alignItems={'center'}>
        {data.event.invite_only && <LockIcon fontSize={'2xl'} />}
        <Heading as="h1">{data.event.name}</Heading>
      </Flex>
      <Heading size="md" as={'h2'}>
        Chapter:{' '}
        <Link href={`/chapters/${chapterId}`}>{data.event.chapter.name}</Link>
      </Heading>
      <Text>{data.event.description}</Text>
      <HStack align="start">
        {rsvps && (
          <Heading
            as={'h3'}
            fontSize={'md'}
            fontWeight={'500'}
            marginRight={'2'}
          >
            RSVPs: {rsvps.length}
          </Heading>
        )}
        {waitlist && (
          <Heading as={'h3'} fontSize={'md'} fontWeight={'500'}>
            Waitlist: {waitlist.length}
          </Heading>
        )}
      </HStack>
      {rsvpStatus === 'yes' ? (
        <HStack>
          <Heading>You&lsquo;ve RSVPed to this event</Heading>
          <Button onClick={onCancelRsvp} paddingInline={'2'} paddingBlock={'1'}>
            Cancel
          </Button>
        </HStack>
      ) : rsvpStatus === 'waitlist' ? (
        <HStack>
          {data.event.invite_only ? (
            <Heading as={'h4'} fontSize={'md'} fontWeight={'500'}>
              Event owner will soon confirm your request
            </Heading>
          ) : (
            <Heading as={'h4'} fontSize={'md'} fontWeight={'500'}>
              You&lsquo;re on waitlist for this event
            </Heading>
          )}
          <Button onClick={onCancelRsvp} paddingInline={'2'} paddingBlock={'1'}>
            Cancel
          </Button>
        </HStack>
      ) : (
        <Button
          data-cy="rsvp-button"
          colorScheme="blue"
          onClick={checkOnRsvp}
          paddingInline={'2'}
          paddingBlock={'1'}
        >
          {data.event.invite_only ? 'Request' : 'RSVP'}
        </Button>
      )}
      {eventUser && (
        <HStack>
          {eventUser.subscribed ? (
            <>
              <Heading as={'h4'} fontSize={'md'} fontWeight={'500'}>
                You are subscribed
              </Heading>
              <Button
                onClick={onUnsubscribeFromEvent}
                paddingInline={'2'}
                paddingBlock={'1'}
              >
                Unsubscribe
              </Button>
            </>
          ) : (
            <>
              <Heading as={'h4'} fontSize={'md'} fontWeight={'500'}>
                Not subscribed
              </Heading>
              <Button
                colorScheme="blue"
                onClick={onSubscribeToEvent}
                paddingInline={'2'}
                paddingBlock={'1'}
              >
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
      <Heading
        data-cy="rsvps-heading"
        size="md"
        as={'h5'}
        fontSize={'md'}
        fontWeight={'400'}
      >
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
          <Heading
            data-cy="waitlist-heading"
            size="md"
            as={'h5'}
            fontSize={'md'}
            fontWeight={'400'}
          >
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
