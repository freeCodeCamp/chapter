import { Button, HStack } from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';
import React, { useMemo, useState } from 'react';

import { CHAPTER, CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENT, DASHBOARD_EVENTS } from '../graphql/queries';
import {
  DATA_PAGINATED_EVENTS_TOTAL_QUERY,
  EVENT,
} from '../../../events/graphql/queries';
import { useAlert } from '../../../../hooks/useAlert';
import { Loading } from '../../../../components/Loading';
import { SharePopOver } from '../../../../components/SharePopOver';
import { checkChapterPermission } from '../../../../util/check-permission';
import {
  ChapterPermission,
  Permission,
} from '../../../../../../common/permissions';
import {
  Chapter,
  Event,
  useCalendarIntegrationStatusQuery,
  useCreateCalendarEventMutation,
  useDeleteEventMutation,
} from '../../../../generated/graphql';
import { useUser } from '../../../auth/user';
import { CalendarEventStatus } from './CalendarEventStatus';
import EventCancelButton from './EventCancelButton';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled' | 'has_calendar_event'>;
  onDelete?: () => any;
  hideCancel?: boolean;
  chapter: Pick<Chapter, 'id' | 'has_calendar'>;
}

const Actions: React.FC<ActionsProps> = ({
  event,
  onDelete,
  hideCancel,
  chapter: { id: chapterId, has_calendar },
}) => {
  const { canceled, has_calendar_event, id: eventId } = event;
  const [isCreatingCalendarEvent, setCreatingCalendarEvent] = useState(false);
  const { user } = useUser();

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery();
  const [createCalendarEvent, { loading: loadingCalendar }] =
    useCreateCalendarEventMutation({
      refetchQueries: [
        { query: EVENT, variables: { eventId } },
        { query: DASHBOARD_EVENT, variables: { eventId } },
      ],
    });
  const [deleteEvent] = useDeleteEventMutation();

  const data = useMemo(
    () => ({
      variables: { eventId },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId } },
        { query: CHAPTERS },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 2 },
        },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
        },
        { query: DASHBOARD_EVENTS },
      ],
    }),
    [event],
  );

  const confirmDelete = useConfirmDelete();
  const confirm = useConfirm();
  const addAlert = useAlert();

  const onClickDelete = async () => {
    const ok = await confirmDelete({
      buttonText: 'Delete event',
      body: 'Are you sure you want to delete this event?',
      title: 'Delete this event?',
    });
    if (ok) {
      await deleteEvent(data);
      await onDelete?.();
    }
  };

  const onCreateCalendarEvent = async () => {
    const ok = await confirm({
      title: 'Create event in chapter calendar',
      body: "Do you want to create this event in chapter's calendar?",
    });
    if (ok) {
      setCreatingCalendarEvent(true);
      try {
        await createCalendarEvent({ variables: { eventId } });
        addAlert({ title: 'Calendar event created', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
      setCreatingCalendarEvent(false);
    }
  };

  if (loadingStatus) <Loading />;
  const integrationStatus = dataStatus?.calendarIntegrationStatus;

  return (
    <>
      {integrationStatus && (
        <CalendarEventStatus
          checkChapterPermission={(permission: ChapterPermission) =>
            checkChapterPermission(user, permission, { chapterId, eventId })
          }
          event={event}
          loadingCalendar={loadingCalendar}
        />
      )}
      <HStack spacing="3">
        <LinkButton
          size={['sm', 'md']}
          colorScheme="blue"
          href={`/dashboard/events/${eventId}/edit`}
        >
          Edit
        </LinkButton>
        {integrationStatus &&
          !has_calendar_event &&
          has_calendar &&
          checkChapterPermission(user, Permission.EventCreate, {
            chapterId,
            eventId,
          }) && (
            <Button
              size={['sm', 'md']}
              colorScheme="blue"
              onClick={onCreateCalendarEvent}
              isLoading={isCreatingCalendarEvent}
            >
              Create calendar event
            </Button>
          )}
        {!hideCancel && !canceled && (
          <EventCancelButton
            size={['sm', 'md']}
            event={event}
            buttonText="Cancel"
          />
        )}
        <Button size={['sm', 'md']} colorScheme="red" onClick={onClickDelete}>
          Delete
        </Button>
        <SharePopOver
          size={['sm', 'md']}
          link={`${process.env.NEXT_PUBLIC_CLIENT_URL}/events/${eventId}?confirm_attendance=true`}
        />
        {user?.admined_chapters && user.admined_chapters?.length >= 2 && (
          <LinkButton
            size={['sm', 'md']}
            colorScheme="blue"
            href={`/dashboard/events/${eventId}/transfer`}
          >
            Transfer
          </LinkButton>
        )}
      </HStack>
    </>
  );
};

export default Actions;
