import { useDisclosure } from '@chakra-ui/hooks';
import { Button, HStack } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';
import React, { useMemo } from 'react';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENT, EVENTS } from '../graphql/queries';
import { EVENT } from '../../../events/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import EventCancelButton from './EventCancelButton';
import SendEmailModal from './SendEmailModal';
import { ShareEventPop } from './ShareEventPopOver';
import { Event, useDeleteEventMutation } from 'generated/graphql';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled'>;
  onDelete?: () => any;
  hideCancel?: boolean;
  chapter_id: number;
}

const Actions: React.FC<ActionsProps> = ({
  event,
  onDelete,
  hideCancel,
  chapter_id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remove] = useDeleteEventMutation();

  const data = useMemo(
    () => ({
      variables: { eventId: event.id },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter_id } },
        { query: EVENT, variables: { eventId: event.id } },
        { query: DASHBOARD_EVENT, variables: { eventId: event.id } },
        { query: EVENTS },
        { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
      ],
    }),
    [event],
  );

  const confirmDelete = useConfirmDelete();

  const clickDelete = async () => {
    const ok = await confirmDelete();
    if (ok) {
      await remove(data);
      await onDelete?.();
    }
  };

  const clickEmailAttendees = () => {
    onOpen();
  };
  return (
    <HStack spacing="1">
      <Button size="sm" colorScheme="red" onClick={clickDelete}>
        Delete
      </Button>
      <LinkButton
        size="sm"
        colorScheme="blue"
        href={`/dashboard/events/${event.id}/edit`}
      >
        Edit
      </LinkButton>
      {!hideCancel && !event.canceled && (
        <EventCancelButton size="sm" event={event} buttonText="Cancel" />
      )}
      <Button size="sm" colorScheme="blue" onClick={clickEmailAttendees}>
        Email Attendees
      </Button>
      <ShareEventPop
        link={`${process.env.NEXT_PUBLIC_CLIENT_URL}/events/${event.id}?emaillink=true`}
      />
      <SendEmailModal onClose={onClose} isOpen={isOpen} eventId={event.id} />
    </HStack>
  );
};

export default Actions;
