import React, { useMemo } from 'react';
import { Button } from '@material-ui/core';
import Link from 'next/link';

import {
  Event,
  useCancelEventMutation,
  useDeleteEventMutation,
} from '../../../../generated';
import useConfirm from '../../../../hooks/useConfirm';
import { EVENT, EVENTS } from '../graphql/queries';

interface ActionsProps {
  event: Pick<Event, 'id' | 'canceled'>;
  onDelete?: () => void;
}

const Actions: React.FC<ActionsProps> = ({ event, onDelete }) => {
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

  const [confirmCancel, clickCancel] = useConfirm(() => cancel(data));
  const [confirmRemove, clickRemove] = useConfirm(() =>
    remove(data).then(() => onDelete && onDelete()),
  );

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
        <Button>
          <a style={{ marginLeft: '10px' }}>Edit</a>
        </Button>
      </Link>
    </>
  );
};

export default Actions;
