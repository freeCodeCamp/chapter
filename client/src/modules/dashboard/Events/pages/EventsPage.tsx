import React from 'react';
import { Grid } from '@material-ui/core';
import Link from 'next/link';
import { NextPage } from 'next';
import { useEventsQuery } from '../../../../generated';
import Layout from '../../shared/components/Layout';

import EventItem from '../components/EventItem';

export const EventsPage: NextPage = () => {
  const { error, loading, data } = useEventsQuery();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link href="/dashboard/events/new">
            <a>Add new</a>
          </Link>
          {error ? (
            <h1>😢Error</h1>
          ) : (
            data?.events.map(event => (
              <EventItem
                event={event}
                loading={loading}
                key={`events-${event.id}`}
              />
            ))
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
