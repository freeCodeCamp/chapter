import React from 'react';
import { Grid } from '@material-ui/core';
import Link from 'next/link';
import { NextPage } from 'next';

import { useVenuesQuery } from '../../../../generated';
import Layout from '../../shared/components/Layout';
import VenueItem from '../components/VenueItem';

export const VenuesPage: NextPage = () => {
  const { loading, error, data } = useVenuesQuery();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link href="/dashboard/venues/new">
            <a>Add new</a>
          </Link>
          {error ? (
            <h1>😢Error</h1>
          ) : (
            data?.venues.map(venue => (
              <VenueItem
                venue={venue}
                loading={loading}
                key={`venue-${venue.id}`}
              />
            ))
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
