import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { NextPage } from 'next';
import { useEventsQuery } from '../../../../generated';
import Layout from '../../shared/components/Layout';

import EventItem from '../components/EventItem';

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

export const EventsPage: NextPage = () => {
  const { error, loading, data } = useEventsQuery();
  const styles = useStyles();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link href="/dashboard/events/new">
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
              {data?.events.map(event => (
                <EventItem
                  event={event}
                  loading={loading}
                  key={`events-${event.id}`}
                />
              ))}
            </div>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
