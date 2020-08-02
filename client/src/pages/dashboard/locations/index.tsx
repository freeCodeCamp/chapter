import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { locationActions } from '../../../modules/dashboard/Events/components/node_modules/client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ILocationModal } from '../../../modules/dashboard/Dashboard/Locations/node_modules/client/store/types/locations';
import useThunkDispatch from '../../../modules/dashboard/Events/components/node_modules/client/hooks/useThunkDispatch';
import LocationItem from 'client/components/Dashboard/Locations/LocationItem';
import Layout from 'client/components/Dashboard/shared/Layout';

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
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
    </Layout>
  );
};

export default Locations;
