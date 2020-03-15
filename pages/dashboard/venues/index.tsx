import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { venueActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import VenueItem from 'client/components/Dashboard/Venues/VenueItem';
import { IVenueModal } from 'client/store/types/venues';
import useThunkDispatch from 'client/hooks/useThunkDispatch';

const Venues: React.FC = () => {
  const { error, loading, venues } = useSelector((state: AppStoreState) => ({
    error: state.venues.error,
    loading: state.venues.loading,
    venues: state.venues.venues,
  }));

  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(venueActions.fetchVenues());
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
        <br />
        <Link href="/dashboard/venues/new">
          <a>Add new</a>
        </Link>
        {error ? (
          <h1>😢Error</h1>
        ) : (
          venues.map((venue: IVenueModal) => (
            <VenueItem
              venue={venue}
              loading={loading}
              key={`venue-${venue.id}`}
            />
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default Venues;
