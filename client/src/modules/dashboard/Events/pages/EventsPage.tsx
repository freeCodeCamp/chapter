import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Link from 'next/link';
import { NextPage } from 'next';

export const EventsPage: NextPage = () => {
  // const { error, loading, data } = useDashb

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
            events.map((event: IEventModal) => (
              <EventItem
                event={event}
                loading={loading && !event}
                key={`events-${event.id}`}
              />
            ))
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
