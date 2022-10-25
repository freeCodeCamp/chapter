import { LockIcon } from '@chakra-ui/icons';
import {
  Heading,
  VStack,
  Text,
  Button,
  useToast,
  List,
  Box,
  HStack,
  Image,
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
  useEventQuery,
  useJoinChapterMutation,
  useRsvpToEventMutation,
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
} from '../../../generated/graphql';
import { useParam } from 'hooks/useParam';
import { useLogin } from 'hooks/useAuth';

export const EventPage: NextPage = () => {
  const { param: eventId } = useParam('eventId');
  const router = useRouter();
  const { user, loadingUser, isLoggedIn } = useAuth();
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

  const { loading, error, data } = useEventQuery({
    variables: { eventId },
  });

  const toast = useToast();
  const confirm = useConfirm();
  const [hasShownModal, setHasShownModal] = React.useState(false);

  const eventUser = useMemo(() => {
    return data?.event?.event_users.find(
      ({ user: event_user }) => event_user.id === user?.id,
    );
  }, [data?.event]);
  const rsvpStatus = eventUser?.rsvp.name;
  const isLoading = loading || loadingUser;
  const canShowConfirmationModal =
    router.query?.ask_to_confirm && !isLoading && isLoggedIn;

  const chapterId = data?.event?.chapter.id;

  // The useEffect has to be before the early return (rule of hooks), but the
  // functions rely on chapterId which cannot be guaranteed to be defined here.
  // It's easy to create bugs by calling arrow functions before they're defined,
  // or by calling functions that rely on variables that aren't defined yet, so
  // we define everything before it's used.

  async function onRsvp(options?: { invited?: boolean }) {
    if (!chapterId) {
      toast({ title: 'Something went wrong', status: 'error' });
      return;
    }

    const confirmOptions = options?.invited
      ? {
          title: 'You have been invited to this event',
          body: `
          Would you like to attend?<br/>
          Note: joining this event will make you a member of the event's chapter.
          `,
        }
      : {
          title: 'Join this event?',
          body: `Note: joining this event will make you a member of the event's chapter.`
        };
    const ok = await confirm(confirmOptions);

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
  async function checkOnRsvp(options?: { invited?: boolean }) {
    if (!user) await login();
    await onRsvp(options);
  }

  // TODO: reimplment this the login modal with Auth0
  async function checkOnCancelRsvp() {
    if (!user) await login();
    await onCancelRsvp();
  }

  useEffect(() => {
    if (canShowConfirmationModal && !hasShownModal) {
      if (!rsvpStatus || rsvpStatus === 'no') {
        checkOnRsvp({ invited: true });
      } else {
        checkOnCancelRsvp();
      }
      setHasShownModal(true);
    }
  }, [hasShownModal, canShowConfirmationModal, rsvpStatus]);

  if (error || isLoading) return <Loading loading={isLoading} error={error} />;
  if (!data?.event)
    return <NextError statusCode={404} title="Event not found" />;

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

  const rsvps = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'yes',
  );
  const waitlist = data.event.event_users.filter(
    ({ rsvp }) => rsvp.name === 'waitlist',
  );

  return (
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
          <Heading data-cy="rsvp-success">
            You&lsquo;ve RSVPed to this event
          </Heading>
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
          onClick={() => checkOnRsvp()}
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
