import React from 'react';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';

import { Event, Tag } from '../../../../generated/graphql';
import { ProgressCardContent } from '../../../../components';
import Tags from './Tag';
import Actions from './Actions';

interface EventItemProps {
  event: Pick<
    Event,
    | 'id'
    | 'name'
    | 'description'
    | 'url'
    | 'video_url'
    | 'capacity'
    | 'canceled'
  > & { tags?: Pick<Tag, 'id' | 'name'>[] | null };
  loading: boolean;
}

const useStyles = makeStyles({
  eventDescription: {
    flexGrow: 1,
  },
});

const EventItem: React.FC<EventItemProps> = ({ loading, event }) => {
  const styles = useStyles();

  return (
    <Card style={{ marginTop: '12px' }}>
      <ProgressCardContent loading={loading}>
        <Grid container spacing={2} direction="column">
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
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={styles.eventDescription}
          >
            {event.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {event.capacity}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {event.description}
          </Typography>
          {event.url && (
            <Typography>
              Event Url: <a href={event.url}>{event.url}</a>
            </Typography>
          )}
          {event.video_url && (
            <Typography>
              Video Url: <a href={event.video_url}>{event.video_url}</a>
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" component="p">
            {event.capacity}
          </Typography>
          <div>{event.tags && <Tags tags={event.tags} />}</div>
          <Actions event={event} />
        </Grid>
      </ProgressCardContent>
    </Card>
  );
};

export default EventItem;
