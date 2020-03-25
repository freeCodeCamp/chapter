import React from 'react';
import { Button } from '@material-ui/core';
import Link from 'next/link';

import { eventActions } from 'client/store/actions';
import useConfirm from 'client/hooks/useConfirm';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import { IEventModal } from 'client/store/types/events';

interface IActionsProps {
  event: IEventModal;
  onDelete?: () => void;
}

const Actions: React.FC<IActionsProps> = ({ event, onDelete }) => {
  const dispatch = useThunkDispatch();

  const [confirmCancel, clickCancel] = useConfirm(() =>
    dispatch(eventActions.cancelEvent(1, event.id)),
  );
  const [confirmRemove, clickRemove] = useConfirm(() => {
    dispatch(eventActions.removeEvent(1, event.id));
    onDelete && onDelete();
  });

  return (
    <>
      {!event.canceled && (
        <Button onClick={clickCancel}>
          {confirmCancel ? 'Are you sure?' : 'Cancel'}
        </Button>
      )}
      <Button onClick={clickRemove}>
        {confirmRemove ? 'Are you sure?' : 'delete'}
      </Button>
      <Link
        href={`/dashboard/events/[id]/edit`}
        as={`/dashboard/events/${event.id}/edit`}
      >
        <a style={{ marginLeft: '10px' }}>Edit</a>
      </Link>
    </>
  );
};

export default Actions;
