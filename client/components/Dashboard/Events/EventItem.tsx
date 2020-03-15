import React from 'react';
import { Card, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import { IEventModal } from 'client/store/types/events';
import { eventActions } from 'client/store/actions';
import useConfirm from 'client/hooks/useConfirm';
import { ProgressCardContent } from 'client/components';

interface IEventItemProps {
  event: IEventModal;
  loading: boolean;
}

const EventItem: React.FC<IEventItemProps> = ({ event, loading }) => {
  const dispatch = useDispatch();

  const [confirmCancel, clickCancel] = useConfirm(() =>
    dispatch(eventActions.cancelEvent(1, event.id)),
  );
  const [confirmRemove, clickRemove] = useConfirm(() =>
    dispatch(eventActions.removeEvent(1, event.id)),
  );

  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <Link
          href="/dashboard/events/[id]"
          as={`/dashboard/events/${event.id}`}
        >
          <a>
            <Typography gutterBottom variant="h5" component="h2">
              {event.name}
            </Typography>
          </a>
        </Link>
        {event.canceled && (
          <Typography variant="h5" color="error">
            Canceled
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" component="p">
          {event.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {event.capacity}
        </Typography>
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
      </ProgressCardContent>
    </Card>
  );
};

export default EventItem;
