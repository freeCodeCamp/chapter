import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';

import { eventActions, venueActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Events/Skeleton';
import { EventForm } from 'client/components/Dashboard/Events';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

const EditEvent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const styles = useStyles();

  const { error, loading, event, venues, venuesLoading } = useSelector(
    (state: AppStoreState) => ({
      error: state.events.error,
      loading: state.events.loading,
      event: state.events.events.find(
        event => event.id === parseInt(Array.isArray(id) ? id[0] : id),
      ),
      venues: state.venues.venues,
      venuesLoading: state.venues.loading,
    }),
  );
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (id !== undefined) {
      console.log(id);
      dispatch(eventActions.fetchEvent('1', id));
      dispatch(venueActions.fetchVenues());
    }
  }, [id]);

  const onSubmit = async data => {
    // const success = await dispatch(
    //   locationActions.updateLocation(
    //     parseInt(Array.isArray(id) ? id[0] : id),
    //     sanitizeFormData(data),
    //   ),
    // );

    console.log(data);

    const success = false;

    if (success) {
      router.replace('/dashboard/locations');
    }
  };

  if (loading || error || !location) {
    return (
      <Skeleton>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.responseDiv}>{error}</div>}
      </Skeleton>
    );
  }

  return (
    <Skeleton>
      <EventForm
        loading={loading}
        onSubmit={onSubmit}
        data={event}
        venues={venues}
        venuesLoading={venuesLoading}
      />
    </Skeleton>
  );
};

export default EditEvent;
