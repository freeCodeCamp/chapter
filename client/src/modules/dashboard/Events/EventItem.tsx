import React from 'react';
import { Card, Typography } from '@material-ui/core';
import Link from 'next/link';

import { IEventModal } from '../../Events/components/node_modules/client/store/types/events';
import { ProgressCardContent } from 'client/components';
import Tags from '../../Events/components/Tag';
import Actions from '../../Events/components/Actions';

interface IEventItemProps {
  event: IEventModal;
  loading: boolean;
}

const EventItem: React.FC<IEventItemProps> = ({ event, loading }) => {
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

        <Tags tags={event.tags} />

        <Actions event={event} />
      </ProgressCardContent>
    </Card>
  );
};

export default EventItem;
