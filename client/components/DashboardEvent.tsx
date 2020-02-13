import React from 'react';
import { Card, Typography } from '@material-ui/core';

import ProgressCardContent from './ProgressCardContent';
import { IEventModal } from 'client/store/types/events';
import Link from 'next/link';

interface IDashboardEventProps {
  event: IEventModal;
  loading: boolean;
}

const DashboardEvent: React.FC<IDashboardEventProps> = ({ event, loading }) => {
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
        <Typography variant="body2" color="textSecondary" component="p">
          {event.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {event.capacity}
        </Typography>
      </ProgressCardContent>
    </Card>
  );
};

export default DashboardEvent;
