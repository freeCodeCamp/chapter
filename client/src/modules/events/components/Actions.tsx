import {
  Button,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useConfirm } from 'chakra-confirm';

import { AttendanceNames } from '../../../../../common/attendance';
import { EVENT } from '../graphql/queries';
import { CHAPTER } from '../../chapters/graphql/queries';
import { DASHBOARD_EVENT } from '../../dashboard/Events/graphql/queries';
import { useUser } from '../../auth/user';
import { meQuery } from '../../auth/graphql/queries';
import { InfoList } from '../../../components/InfoList';
import {
  useAttendEventMutation,
  useCancelAttendanceMutation,
  useJoinChapterMutation,
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
} from '../../../generated/graphql';
import { useAlert } from '../../../hooks/useAlert';
import { useSession } from '../../../hooks/useSession';
import { Loading } from '../../../components/Loading';
import { Modal } from '../../../components/Modal';
import { useSubscribeCheckbox } from '../../../components/SubscribeCheckbox';

type ActionsProps = {
  event: {
    chapter: { id: number };
    id: number;
    invite_only: boolean;
    event_users: { attendance: { name: string }; user: { id: number } }[];
  };
};

const buttonStyleProps = {
  paddingBlock: 1,
  paddingInline: 2,
};

const textStyleProps = {
  fontSize: 'md',
  fontWeight: 500,
};

export const Actions = ({
  event: {
    id: eventId,
    chapter: { id: chapterId },
    invite_only: inviteOnly,
    event_users,
  },
}: ActionsProps) => {
  const router = useRouter();
  const { user, loadingUser, isLoggedIn } = useUser();
  const { login, error: loginError } = useSession();
  const modalProps = useDisclosure();

  const addAlert = useAlert();
  const confirm = useConfirm();
  const [hasShownModal, setHasShownModal] = useState(false);
  const [awaitingLogin, setAwaitingLogin] = useState(false);

  const { getSubscribe, SubscribeCheckbox } = useSubscribeCheckbox(
    !!user?.auto_subscribe,
  );

  const eventUser = useMemo(() => {
    return event_users.find(
      ({ user: event_user }) => event_user.id === user?.id,
    );
  }, [event_users, user]);
  const userEvent = user?.user_events.find(
    ({ event_id }) => event_id === eventId,
  );
  const waitlist = event_users.filter(
    ({ attendance }) => attendance.name === AttendanceNames.waitlist,
  );

  const attendanceStatus = eventUser?.attendance.name;

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
      ...(waitlist.length > 0 &&
        !inviteOnly && {
          body: 'The next person on the waitlist will take your seat.',
        }),
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
    <InfoList
      items={[
        "Attending this event will make you a member of the event's chapter.",
        'If event capacity if full, you will be placed on the waitlist.',
      ]}
    />
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
      const eventUser = event_users.find(
        ({ user: event_user }) => event_user.id === user?.id,
      );
      if (!isAlreadyAttending(eventUser?.attendance.name)) onAttend();
    }
  }, [awaitingLogin, isLoggedIn]);

  const canShowConfirmationModal = router.query?.confirm_attendance;

  useEffect(() => {
    if (canShowConfirmationModal && !hasShownModal) {
      if (!isAlreadyAttending(attendanceStatus)) {
        tryToAttend({ invited: true });
      }
      setHasShownModal(true);
    }
  }, [hasShownModal, canShowConfirmationModal, attendanceStatus]);

  async function onSubscribeToEvent() {
    const ok = await confirm({
      title: 'Subscribe to event updates?',
      body: (
        <InfoList
          items={[
            'You will be informed about any changes to event details.',
            'This does not affect notifications from Google Calendar.',
          ]}
        />
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
        <InfoList
          items={[
            'After unsubscribing you will not receive any communication regarding this event, including reminder before the event',
            ' This does not affect notifications from Google Calendar.',
          ]}
        />
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

  if (loadingUser) return <Loading />;

  return (
    <>
      <Modal modalProps={modalProps} title="Waiting for login">
        {loginError ? (
          <>Something went wrong, {loginError.message}</>
        ) : (
          <Spinner />
        )}
      </Modal>
      <SimpleGrid columns={2} gap={5} alignItems="center">
        {!attendanceStatus || attendanceStatus === AttendanceNames.canceled ? (
          <>
            <Text {...textStyleProps}>Not attending the event</Text>
            <Button
              {...buttonStyleProps}
              colorScheme="blue"
              data-cy="attend-button"
              isLoading={loadingAttend}
              onClick={() => tryToAttend()}
            >
              {inviteOnly ? 'Request Invite' : 'Attend Event'}
            </Button>
          </>
        ) : (
          <>
            {attendanceStatus === AttendanceNames.waitlist ? (
              <Text {...textStyleProps}>
                {inviteOnly
                  ? 'Event owner will soon confirm your request'
                  : "You're on waitlist for this event"}
              </Text>
            ) : (
              <Text data-cy="attend-success">You are attending this event</Text>
            )}
            <Button
              {...buttonStyleProps}
              isLoading={loadingCancel}
              onClick={onCancelAttendance}
            >
              Cancel
            </Button>
          </>
        )}
        {userEvent && (
          <>
            {userEvent.subscribed ? (
              <>
                <Text {...textStyleProps}>
                  You are subscribed to event updates
                </Text>
                <Button
                  {...buttonStyleProps}
                  isLoading={loadingUnsubscribe}
                  onClick={onUnsubscribeFromEvent}
                >
                  Unsubscribe
                </Button>
              </>
            ) : (
              <>
                <Text {...textStyleProps}>Not subscribed to event updates</Text>
                <Button
                  {...buttonStyleProps}
                  colorScheme="blue"
                  isLoading={loadingSubscribe}
                  onClick={onSubscribeToEvent}
                >
                  Subscribe
                </Button>
              </>
            )}
          </>
        )}
      </SimpleGrid>
    </>
  );
};
