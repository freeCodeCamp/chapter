import { Button, HStack } from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';
import React, { useMemo } from 'react';

import { CHAPTER } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENT, DASHBOARD_EVENTS } from '../graphql/queries';
import { EVENT } from '../../../events/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { SharePopOver } from '../../../../components/SharePopOver';
import EventCancelButton from './EventCancelButton';
import {
  Chapter,
  Event,
  useCreateCalendarEventMutation,
  useDeleteEventMutation,
} from 'generated/graphql';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled' | 'calendar_event_id'>;
  onDelete?: () => any;
  hideCancel?: boolean;
  chapter: Pick<Chapter, 'id' | 'calendar_id'>;
}

const Actions: React.FC<ActionsProps> = ({
  event,
  onDelete,
  hideCancel,
  chapter,
}) => {
  const [remove] = useDeleteEventMutation();
  const [createCalendarEvent] = useCreateCalendarEventMutation();

  const data = useMemo(
    () => ({
      variables: { eventId: event.id },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter.id } },
        { query: EVENT, variables: { eventId: event.id } },
        { query: DASHBOARD_EVENT, variables: { eventId: event.id } },
        { query: DASHBOARD_EVENTS, variables: { showCanceled: true } },
        { query: DASHBOARD_EVENTS, variables: { showCanceled: false } },
        { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
      ],
    }),
    [event],
  );

  const confirmDelete = useConfirmDelete();
  const confirm = useConfirm();

  const clickDelete = async () => {
    const ok = await confirmDelete();
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
      await createCalendarEvent({
        variables: { eventId: event.id },
        refetchQueries: [
          { query: DASHBOARD_EVENT, variables: { eventId: event.id } },
          { query: EVENT, variables: { eventId: event.id } },
        ],
      });
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
      {!event.calendar_event_id && chapter.calendar_id && (
        <Button
          size={['sm', 'md']}
          colorScheme="blue"
          onClick={onCreateCalendarEvent}
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
        link={`${process.env.NEXT_PUBLIC_CLIENT_URL}/events/${event.id}?confirm_rsvp=true`}
      />
    </HStack>
  );
};

export default Actions;
