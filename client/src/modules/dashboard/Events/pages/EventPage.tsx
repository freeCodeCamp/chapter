import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Card, Typography, CardContent } from '@material-ui/core';

import { Layout } from '../../shared/components/Layout';
import { useEventQuery } from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import { ProgressCardContent } from '../../../../components';
import getLocationString from '../../../../helpers/getLocationString';
import Actions from '../components/Actions';

export const EventPage: NextPage = () => {
  const router = useRouter();
  const id = getId(router.query) || -1;
  const { loading, error, data } = useEventQuery({ variables: { id } });

  if (loading || error || !data || !data.event) {
    return (
      <Layout>
        <h1>
          {loading ? 'Loading...' : !error ? "Can't find event :(" : 'Error...'}
        </h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card style={{ marginTop: '12px' }}>
        <ProgressCardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.event.name}
          </Typography>
          {data.event.canceled && (
            <Typography variant="h5" color="error">
              Canceled
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" component="p">
            {data.event.description}
          </Typography>
          {data.event.url && (
            <Typography>
              Event Url: <a href={data.event.url}>{data.event.url}</a>
            </Typography>
          )}
          {data.event.video_url && (
            <Typography>
              Video Url:{' '}
              <a href={data.event.video_url}>{data.event.video_url}</a>
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" component="p">
            {data.event.capacity}
          </Typography>
          {/* <Tags tags={data.event.tags} /> */}

          <Actions
            event={data.event}
            onDelete={() => router.replace('/dashboard/events')}
          />
          {data.event.venue ? (
            <>
              <h2>Venue:</h2>
              <h1 style={{ padding: 0 }}>{data.event.venue.name}</h1>
              <h4>{getLocationString(data.event.venue, true)}</h4>
            </>
          ) : (
            <h2>Venue: Online</h2>
          )}
        </ProgressCardContent>
      </Card>
      <Card style={{ marginTop: '12px' }}>
        <CardContent>
          <h2>RSVPs:</h2>
          {data.event.rsvps.length > 0 ? (
            <div>
              <ul>
                {data.event.rsvps
                  .filter((rsvp) => !rsvp.on_waitlist)
                  .map((rsvp) => (
                    <li key={rsvp.id}>
                      {rsvp.user ? rsvp.user.name : `#${rsvp.id}`}
                    </li>
                  ))}
              </ul>
              <br />
              <h3>On waiting list</h3>
              <ul>
                {data.event.rsvps
                  .filter((rsvp) => rsvp.on_waitlist)
                  .map((rsvp) => (
                    <li key={rsvp.id}>
                      {rsvp.user ? rsvp.user.name : `#${rsvp.id}`}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <h3>No rsvps</h3>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};
