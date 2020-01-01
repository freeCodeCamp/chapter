import React, { useEffect } from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { ProgressCardContent } from 'client/components';
import { AppStoreState } from 'client/store/reducers';
import { eventActions } from 'client/store/actions';
import { IEventModal } from 'client/store/types/events';

const Events: React.FC = () => {
  const { error, loading, events } = useSelector((state: AppStoreState) => ({
    error: state.events.error,
    loading: state.events.loading,
    events: state.events.events,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventActions.fetchEvents('1'));
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <button>Add new</button>
          {error ? (
            <h1>😢Error</h1>
          ) : (
            events.map((event: IEventModal) => (
              <Card style={{ marginTop: '12px' }} key={`event-${event.id}`}>
                <ProgressCardContent loading={loading}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {event.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {event.capacity}
                  </Typography>
                </ProgressCardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Events;
