import { InfoIcon, LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import { Link } from 'chakra-next-link';
import { NextPage } from 'next';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { useUser } from '../../auth/user';
import Avatar from '../../../components/Avatar';
import { useSubscribeCheckbox } from '../../../components/SubscribeCheckbox';
import { Loading } from '../../../components/Loading';
import { Modal } from '../../../components/Modal';
import SponsorsCard from '../../../components/SponsorsCard';
import UserName from '../../../components/UserName';
import { EVENT } from '../graphql/queries';
import { DASHBOARD_EVENT } from '../../dashboard/Events/graphql/queries';
import { meQuery } from '../../auth/graphql/queries';
import {
  useCancelAttendanceMutation,
  useEventQuery,
  useJoinChapterMutation,
  useAttendEventMutation,
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
} from '../../../generated/graphql';
import { formatDate } from '../../../util/date';
import { useAlert } from '../../../hooks/useAlert';
import { useParam } from '../../../hooks/useParam';
import { useSession } from '../../../hooks/useSession';
import { CHAPTER } from '../../chapters/graphql/queries';
import { AttendanceNames } from '../../../../../common/attendance';

export const EventPage: NextPage = () => {
  const { param: eventId } = useParam('eventId');
  const router = useRouter();
  const { user, loadingUser, isLoggedIn } = useUser();
  const { login, error: loginError } = useSession();
  const modalProps = useDisclosure();

  const refetch = {
    refetchQueries: [
      { query: EVENT, variables: { eventId } },
      { query: DASHBOARD_EVENT, variables: { eventId } },
      { query: meQuery },
    ],
  };

  const [attendEvent, { loading: loadingAttend }] =
    useAttendEventMutation(refetch);
  const [cancelAttendance, { loading: loadingCancel }] =
    useCancelAttendanceMutation(refetch);
  const [joinChapter] = useJoinChapterMutation();
  const [subscribeToEvent, { loading: loadingSubscribe }] =
    useSubscribeToEventMutation(refetch);
  const [unsubscribeFromEvent, { loading: loadingUnsubscribe }] =
    useUnsubscribeFromEventMutation(refetch);

  const { loading, error, data } = useEventQuery({
    variables: { eventId },
  });

  const addAlert = useAlert();
  const confirm = useConfirm();
  const [hasShownModal, setHasShownModal] = useState(false);
  const [awaitingLogin, setAwaitingLogin] = useState(false);

  const { getSubscribe, SubscribeCheckbox } = useSubscribeCheckbox(
    !!user?.auto_subscribe,
  );

  const eventUser = useMemo(() => {
    return data?.event?.event_users.find(
      ({ user: event_user }) => event_user.id === user?.id,
    );
  }, [data?.event, user]);
  const userEvent = user?.user_events.find(
    ({ event_id }) => event_id === eventId,
  );
  const attendanceStatus = eventUser?.attendance.name;
  const isLoading = loading || loadingUser;
  const canShowConfirmationModal =
    router.query?.confirm_attendance && !isLoading;
  const chapterId = data?.event?.chapter.id;

  // The useEffect has to be before the early return (rule of hooks), but the
  // functions rely on chapterId which cannot be guaranteed to be defined here.
  // It's easy to create bugs by calling arrow functions before they're defined,
  // or by calling functions that rely on variables that aren't defined yet, so
  // we define everything before it's used.
  function isAlreadyAttending(attencanceStatus: string | undefined) {
    const alreadyAttending =
      attencanceStatus === AttendanceNames.confirmed ||
      attencanceStatus === AttendanceNames.waitlist;
    if (alreadyAttending) {
      addAlert({ title: 'Already attending', status: 'info' });
      return true;
    }
    return false;
  }

  async function onAttend(subscribeToChapter?: boolean) {
    if (!chapterId) {
      addAlert({ title: 'Something went wrong', status: 'error' });
      return;
    }
    try {
      await joinChapter({
        variables: { chapterId, subscribe: subscribeToChapter },
        refetchQueries: [
          ...refetch.refetchQueries,
          { query: CHAPTER, variables: { chapterId } },
        ],
      });
      const { data: dataAttend } = await attendEvent({
        variables: { eventId, chapterId },
      });

      const attendance = dataAttend?.attendEvent.attendance.name;

      addAlert({
        title:
          attendance === AttendanceNames.confirmed
            ? 'You are attending this event'
            : 'You are on the waitlist',
        status: 'success',
      });
    } catch (err) {
      addAlert({ title: 'Something went wrong', status: 'error' });
      console.error(err);
    }
  }

  async function onCancelAttendance() {
    const ok = await confirm({
      title: 'Are you sure you want to cancel your attendance?',
    });

    if (ok) {
      try {
        await cancelAttendance({
          variables: { eventId },
        });

        addAlert({ title: 'You canceled your attendance 👋', status: 'info' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  }

  const AttendInfo = () => (
    <List>
      <ListItem>
        <ListIcon as={InfoIcon} boxSize={5} />
        Attending this event will make you a member of the event&apos;s chapter.
      </ListItem>
      <ListItem>
        <ListIcon as={InfoIcon} boxSize={5} />
        If event capacity if full, you will be placed on the waitlist.
      </ListItem>
    </List>
  );

  async function tryToAttend(options?: { invited?: boolean }) {
    const chapterUser = user?.user_chapters.find(
      ({ chapter_id }) => chapter_id == chapterId,
    );
    const confirmOptions = options?.invited
      ? {
          title: 'You have been invited to this event',
          body: (
            <>
              {user ? (
                <>
                  Would you like to attend?
                  {!chapterUser && (
                    <>
                      <AttendInfo />
                      <SubscribeCheckbox label="Send me notifications about new events" />
                    </>
                  )}
                </>
              ) : (
                'Would you like to log in and attend this event?'
              )}
            </>
          ),
        }
      : {
          title: 'Attend this event?',
          body: (
            <>
              <AttendInfo />
              {user && !chapterUser && (
                <SubscribeCheckbox label="Send me notifications about new events" />
              )}
            </>
          ),
        };
    const ok = await confirm(confirmOptions);
    if (!ok) return;

    if (user) {
      await onAttend(getSubscribe());
      return;
    }
    modalProps.onOpen();
    login();

    // TODO: handling async events (like login finishing) using state and
    // effects is not pretty. Post MVP, we should try to find a less hacky
    // approach.
    setAwaitingLogin(true);
  }

  useEffect(() => {
    if (awaitingLogin && isLoggedIn) {
      setAwaitingLogin(false);
      modalProps.onClose();
      const eventUser = data?.event?.event_users.find(
        ({ user: event_user }) => event_user.id === user?.id,
      );
      if (!isAlreadyAttending(eventUser?.attendance.name)) onAttend();
    }
  }, [awaitingLogin, isLoggedIn]);

  useEffect(() => {
    if (canShowConfirmationModal && !hasShownModal) {
      if (!isAlreadyAttending(attendanceStatus)) {
        tryToAttend({ invited: true });
      }
      setHasShownModal(true);
    }
  }, [hasShownModal, canShowConfirmationModal, attendanceStatus]);

  if (error || isLoading) return <Loading error={error} />;
  if (!data?.event)
    return <NextError statusCode={404} title="Event not found" />;

  async function onSubscribeToEvent() {
    const ok = await confirm({
      title: 'Subscribe to event updates?',
      body: (
        <List>
          <ListItem>
            <ListIcon as={InfoIcon} boxSize={5} />
            You will be informed about any changes to event details.
          </ListItem>
          <ListItem>
            <ListIcon as={InfoIcon} boxSize={5} />
            This does not affect notifications from Google Calendar.
          </ListItem>
        </List>
      ),
    });
    if (ok) {
      try {
        await subscribeToEvent({ variables: { eventId } });
        addAlert({
          title: 'You successfully subscribed to event updates',
          status: 'success',
        });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  }

  async function onUnsubscribeFromEvent() {
    const ok = await confirm({
      title: 'Unsubscribe from event updates?',
      body: (
        <List>
          <ListItem>
            <ListIcon as={InfoIcon} boxSize={5} />
            After unsubscribing you will not receive any communication regarding
            this event, including reminder before the event.
          </ListItem>
          <ListItem>
            <ListIcon as={InfoIcon} boxSize={5} />
            This does not affect notifications from Google Calendar.
          </ListItem>
        </List>
      ),
    });
    if (ok) {
      try {
        await unsubscribeFromEvent({ variables: { eventId } });
        addAlert({
          title: 'You have unsubscribed from event updates',
          status: 'info',
        });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  }

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
      <Modal modalProps={modalProps} title="Waiting for login">
        {loginError ? (
          <>Something went wrong, {loginError.message}</>
        ) : (
          <Spinner />
        )}
      </Modal>
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
          <Text fontWeight={500} fontSize={'md'} color="red.500">
            Canceled
          </Text>
        )}
        <Text fontSize={['md', 'lg', 'xl']} fontWeight={'500'}>
          Chapter:{' '}
          <Link href={`/chapters/${chapterId}`}>{data.event.chapter.name}</Link>
        </Text>
        <Text fontWeight={'500'} fontSize={['smaller', 'sm', 'md']}>
          {data.event.description}
        </Text>
        <Text fontWeight={'500'} fontSize={['smaller', 'sm', 'md']}>
          Starting: {startAt}
        </Text>
        <Text fontWeight={'500'} fontSize={['smaller', 'sm', 'md']}>
          Ending: {endsAt}
        </Text>
        <SimpleGrid columns={2} gap={5} alignItems="center">
          {!attendanceStatus ||
          attendanceStatus === AttendanceNames.canceled ? (
            <Button
              colorScheme="blue"
              data-cy="attend-button"
              isLoading={loadingAttend}
              onClick={() => tryToAttend()}
              paddingBlock="1"
              paddingInline="2"
            >
              {data.event.invite_only ? 'Request Invite' : 'Attend Event'}
            </Button>
          ) : (
            <>
              {attendanceStatus === AttendanceNames.waitlist ? (
                <Text fontSize="md" fontWeight="500">
                  {data.event.invite_only
                    ? 'Event owner will soon confirm your request'
                    : "You're on waitlist for this event"}
                </Text>
              ) : (
                <Text data-cy="attend-success">
                  You are attending this event
                </Text>
              )}
              <Button
                isLoading={loadingCancel}
                onClick={onCancelAttendance}
                paddingBlock="1"
                paddingInline="2"
              >
                Cancel
              </Button>
            </>
          )}
          {userEvent && (
            <>
              {userEvent.subscribed ? (
                <>
                  <Text fontSize={'md'} fontWeight={'500'}>
                    You are subscribed to event updates
                  </Text>
                  <Button
                    isLoading={loadingUnsubscribe}
                    onClick={onUnsubscribeFromEvent}
                    paddingBlock="1"
                    paddingInline="2"
                  >
                    Unsubscribe
                  </Button>
                </>
              ) : (
                <>
                  <Text fontSize={'md'} fontWeight={'500'}>
                    Not subscribed to event updates
                  </Text>
                  <Button
                    colorScheme="blue"
                    isLoading={loadingSubscribe}
                    onClick={onSubscribeToEvent}
                    paddingBlock="1"
                    paddingInline="2"
                  >
                    Subscribe
                  </Button>
                </>
              )}
            </>
          )}
        </SimpleGrid>

        {data.event.sponsors.length ? (
          <SponsorsCard sponsors={data.event.sponsors} />
        ) : (
          false
        )}
        <Heading
          data-cy="attendees-heading"
          fontSize={['sm', 'md', 'lg']}
          as={'h2'}
        >
          Attendees:
        </Heading>
        <List>
          {attendees.map(({ user }) => (
            <ListItem key={user.id} mb="2">
              <HStack>
                <Avatar user={user} />
                <UserName user={user} fontSize="xl" fontWeight="bold" />
              </HStack>
            </ListItem>
          ))}
        </List>

        {!data.event.invite_only && (
          <>
            <Heading
              data-cy="waitlist-heading"
              fontSize={['sm', 'md', 'lg']}
              as={'h2'}
            >
              Waitlist:
            </Heading>
            <List>
              {waitlist.map(({ user }) => (
                <ListItem key={user.id} mb="2">
                  <HStack>
                    <Avatar user={user} />
                    <UserName user={user} fontSize="xl" fontWeight="bold" />
                  </HStack>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </VStack>
    </>
  );
};
