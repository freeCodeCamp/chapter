import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Card, Typography, CardContent } from '@material-ui/core';

import Layout from '../../shared/components/Layout';
import Skeleton from '../../Venues/components/Skeleton';
import { useEventQuery } from '../../../../generated';
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
        <Skeleton>
          <h1>
            {loading
              ? 'Loading...'
              : !error
              ? "Can't find event :("
              : 'Error...'}
          </h1>
        </Skeleton>
      </Layout>
    );
  }

  return (
    <Layout>
      <Skeleton>
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
            <a href={data.event.url}>{data.event.url}</a>
            <Typography variant="body2" color="textSecondary" component="p">
              {data.event.capacity}
            </Typography>
            {/* <Tags tags={data.event.tags} /> */}

            <Actions
              event={data.event}
              onDelete={() => router.replace('/dashboard/events')}
            />

            <h2>Venue:</h2>
            <h1 style={{ padding: 0 }}>{data.event.venue.name}</h1>
            <h4>{getLocationString(data.event.venue, true)}</h4>
          </ProgressCardContent>
        </Card>
        <Card style={{ marginTop: '12px' }}>
          <CardContent>
            <h2>RSVPs:</h2>
            {data.event.rsvps.length > 0 ? (
              <div>
                <ul>
                  {data.event.rsvps
                    .filter(rsvp => !rsvp.on_waitlist)
                    .map(rsvp => (
                      <li key={rsvp.id}>
                        {rsvp.user
                          ? `${rsvp.user.first_name} ${rsvp.user.last_name}`
                          : `#${rsvp.id}`}
                      </li>
                    ))}
                </ul>
                <br />
                <h3>On waiting list</h3>
                <ul>
                  {data.event.rsvps
                    .filter(rsvp => rsvp.on_waitlist)
                    .map(rsvp => (
                      <li key={rsvp.id}>
                        {rsvp.user
                          ? `${rsvp.user.first_name} ${rsvp.user.last_name}`
                          : `#${rsvp.id}`}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <h3>No rsvps</h3>
            )}
          </CardContent>
        </Card>
      </Skeleton>
    </Layout>
  );
};
