import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { AppStoreState } from 'client/store/reducers';
import { eventActions } from 'client/store/actions';
import { IEventModal } from 'client/store/types/events';
import DashboardEvent from 'client/components/DashboardEvent';
import useThunkDispatch from 'client/hooks/useThunkDispatch';

const Events: React.FC = () => {
  const { error, loading, events } = useSelector((state: AppStoreState) => ({
    error: state.events.error,
    loading: state.events.loading,
    events: state.events.events,
  }));
  const dispatch = useThunkDispatch();

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
              <DashboardEvent
                event={event}
                loading={loading}
                key={`events-${event.id}`}
              />
            ))
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Events;
