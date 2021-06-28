import React, { useMemo } from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import {
  Event,
  useCancelEventMutation,
  useDeleteEventMutation,
} from 'generated/graphql';
import { EVENT, EVENTS } from '../graphql/queries';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled'>;
  onDelete?: () => any;
  hideCancel?: boolean;
}

const Actions: React.FC<ActionsProps> = ({ event, onDelete, hideCancel }) => {
  const [cancel] = useCancelEventMutation();
  const [remove] = useDeleteEventMutation();

  const data = useMemo(
    () => ({
      variables: { id: event.id },
      refetchQueries: [
        { query: EVENT, variables: { id: event.id } },
        { query: EVENTS },
      ],
    }),
    [event],
  );

  const confirmCancel = useConfirm({
    title: 'Are you sure you want to cancel this',
    body: 'Canceling this will send emails to everyone who RSVPd',
    buttonColor: 'orange',
  });
  const confirmDelete = useConfirmDelete();

  const clickCancel = async () => {
    const ok = await confirmCancel();
    if (ok) {
      await cancel(data);
    }
  };

  const clickDelete = async () => {
    const ok = await confirmDelete();
    if (ok) {
      await remove(data);
      await onDelete?.();
    }
  };

  return (
    <HStack spacing="1">
      <Button size="sm" colorScheme="red" onClick={clickDelete}>
        Delete
      </Button>
      <LinkButton
        size="sm"
        colorScheme="green"
        href={`/dashboard/events/${event.id}/edit`}
      >
        Edit
      </LinkButton>
      {!hideCancel && !event.canceled && (
        <Button size="sm" colorScheme="orange" onClick={clickCancel}>
          Cancel
        </Button>
      )}
    </HStack>
  );
};

export default Actions;
