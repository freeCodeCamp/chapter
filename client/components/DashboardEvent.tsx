import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import ProgressCardContent from './ProgressCardContent';
import { IEventModal } from 'client/store/types/events';
import { eventActions } from 'client/store/actions';

interface IDashboardEventProps {
  event: IEventModal;
  loading: boolean;
}

const DashboardEvent: React.FC<IDashboardEventProps> = ({ event, loading }) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const dispatch = useDispatch();

  const cancel = () => {
    if (confirm) {
      dispatch(eventActions.cancelEvent(1, event.id));
    } else {
      setConfirm(true);
    }
  };

  useEffect(() => {
    if (confirm) {
      setTimeout(() => {
        setConfirm(false);
      }, 2000);
    }
  }, [confirm]);

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
          <Button onClick={cancel}>
            {confirm ? 'Are you sure?' : 'Cancel'}
          </Button>
        )}
      </ProgressCardContent>
    </Card>
  );
};

export default DashboardEvent;
