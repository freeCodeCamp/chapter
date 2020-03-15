import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

import { venueActions, locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import VenueForm from 'client/components/VenueForm';
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

  if (loading) return <h1>Loading...</h1>;
  if (error || !venue) {
    console.error(error);
    return (
      <>
        <h1>Error...</h1>
        <div className={styles.responseDiv}>{error}</div>
      </>
    );
  }

  return (
    <VenueForm
      loading={loading}
      onSubmit={onSubmit}
      locations={locations}
      locationsLoading={locationsLoading}
      data={venue}
      submitText={'Update venue'}
    />
  );
};

export default EditVenue;
