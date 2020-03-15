import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

import { venueActions, locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { VenueForm, Skeleton } from 'client/components/Dashboard/Venues';
import sanitizeFormData from 'client/helpers/sanitizeFormData';
import useThunkDispatch from 'client/hooks/useThunkDispatch';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

const EditVenue: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const styles = useStyles();

  const { error, loading, venue, locations, locationsLoading } = useSelector(
    (state: AppStoreState) => ({
      error: state.venues.error,
      loading: state.venues.loading,
      venue: state.venues.venues.find(
        venue => venue.id === parseInt(Array.isArray(id) ? id[0] : id),
      ),
      locations: state.locations.locations,
      locationsLoading: state.locations.loading,
    }),
  );
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(venueActions.fetchOneVenue(id));
      dispatch(locationActions.fetchLocations());
    }
  }, [id]);

  const onSubmit = async data => {
    const success = await dispatch(
      venueActions.updateVenue(
        parseInt(Array.isArray(id) ? id[0] : id),
        sanitizeFormData(data),
      ),
    );

    if (success) {
      router.replace('/dashboard/venues');
    }
  };

  if (loading || error || !venue) {
    return (
      <Skeleton>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.responseDiv}>{error}</div>}
      </Skeleton>
    );
  }

  return (
    <Skeleton>
      <VenueForm
        loading={loading}
        onSubmit={onSubmit}
        locations={locations}
        locationsLoading={locationsLoading}
        data={venue}
        submitText={'Update venue'}
      />
    </Skeleton>
  );
};

export default EditVenue;
