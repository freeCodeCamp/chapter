import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ILocationModal } from 'client/store/types/locations';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import LocationItem from 'client/components/Dashboard/Locations/LocationItem';

const Locations: React.FC = () => {
  const { error, loading, locations } = useSelector((state: AppStoreState) => ({
    error: state.locations.error,
    loading: state.locations.loading,
    locations: state.locations.locations,
  }));

  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(locationActions.fetchLocations());
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
        <br />
        <Link href="/dashboard/locations/new">
          <a>Add new</a>
        </Link>
        {error ? (
          <h1>😢Error</h1>
        ) : (
          locations.map((location: ILocationModal) => (
            <LocationItem
              location={location}
              loading={loading}
              key={`location-${location.id}`}
            />
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default Locations;
