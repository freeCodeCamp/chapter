import { Button, HStack } from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';
import React, { useMemo, useState } from 'react';

import { CHAPTER, CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENTS } from '../graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../../../events/graphql/queries';
import { useAlert } from '../../../../hooks/useAlert';
import { SharePopOver } from '../../../../components/SharePopOver';
import { checkChapterPermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import {
  Chapter,
  CreateCalendarEventMutationFn,
  Event,
  useDeleteEventMutation,
} from '../../../../generated/graphql';
import { useUser } from '../../../auth/user';
import EventCancelButton from './EventCancelButton';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled' | 'has_calendar_event'>;
  onDelete?: () => any;
  hideCancel?: boolean;
  chapter: Pick<Chapter, 'id' | 'has_calendar'>;
  integrationStatus: boolean | null | undefined;
  createCalendarEvent: CreateCalendarEventMutationFn;
}

const Actions: React.FC<ActionsProps> = ({
  event,
  onDelete,
  hideCancel,
  chapter,
  integrationStatus,
  createCalendarEvent,
}) => {
  const [isCreatingCalendarEvent, setCreatingCalendarEvent] = useState(false);
  const { user } = useUser();
  const [remove] = useDeleteEventMutation();

  const data = useMemo(
    () => ({
      variables: { eventId: event.id },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter.id } },
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

  const clickDelete = async () => {
    const ok = await confirmDelete({
      buttonText: 'Delete event',
      body: 'Are you sure you want to delete this event?',
      title: 'Delete this event?',
    });
    if (ok) {
      await remove(data);
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
        await createCalendarEvent({ variables: { eventId: event.id } });
        addAlert({ title: 'Calendar event created', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
      setCreatingCalendarEvent(false);
    }
  };

  return (
    <HStack spacing="3">
      <LinkButton
        size={['sm', 'md']}
        colorScheme="blue"
        href={`/dashboard/events/${event.id}/edit`}
      >
        Edit
      </LinkButton>
      {integrationStatus &&
        !event.has_calendar_event &&
        chapter.has_calendar &&
        checkChapterPermission(user, Permission.EventCreate, {
          chapterId: chapter.id,
          eventId: event.id,
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
      {!hideCancel && !event.canceled && (
        <EventCancelButton
          size={['sm', 'md']}
          event={event}
          buttonText="Cancel"
        />
      )}
      <Button size={['sm', 'md']} colorScheme="red" onClick={clickDelete}>
        Delete
      </Button>
      <SharePopOver
        size={['sm', 'md']}
        link={`${process.env.NEXT_PUBLIC_CLIENT_URL}/events/${event.id}?confirm_attendance=true`}
      />
    </HStack>
  );
};

export default Actions;
