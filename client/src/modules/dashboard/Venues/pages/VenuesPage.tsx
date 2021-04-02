import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { NextPage } from 'next';

import { useVenuesQuery } from '../../../../generated';
import Layout from '../../shared/components/Layout';
import VenueItem from '../components/VenueItem';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridAutoRows: '1fr',
    gridGap: '1rem',
  },
  gridItem: {
    padding: '0.5rem',
  },
});

export const VenuesPage: NextPage = () => {
  const { loading, error, data } = useVenuesQuery();
  const styles = useStyles();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link href="/dashboard/venues/new">
            <Button variant="outlined">
              <a>Add new</a>
            </Button>
          </Link>
          {error ? (
            <>
              <Typography variant="h1" component="h1">
                Error
              </Typography>
              <Typography variant="body1" component="p">
                {error.name}: {error.message}
              </Typography>
            </>
          ) : (
            <div className={styles.grid}>
              {data?.venues.map(venue => (
                <VenueItem
                  venue={venue}
                  loading={loading}
                  key={`venue-${venue.id}`}
                />
              ))}
            </div>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
