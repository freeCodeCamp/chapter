import React from 'react';
import { Card, Typography } from '@material-ui/core';

import { IEventModal } from 'client/store/types/events';
import { ProgressCardContent } from 'client/components';

interface IEventItemProps {
  event: IEventModal;
  loading: boolean;
}

const EventItem: React.FC<IEventItemProps> = ({ event, loading }) => {
  return (
    <Card style={{ marginTop: '12px' }} key={`event-${event.id}`}>
      <ProgressCardContent loading={loading}>
        <Typography gutterBottom variant="h5" component="h2">
          {event.name}
        </Typography>
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

export default EventItem;
