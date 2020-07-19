import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography, CardContent } from '@material-ui/core';
import { useRouter } from 'next/router';

import { eventActions, venueActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from 'client/components';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Events/Skeleton';
import Layout from 'client/components/Dashboard/shared/Layout';
import Tags from 'client/components/Dashboard/Events/components/Tag';
import getLocationString from 'client/helpers/getLocationString';
import Actions from 'client/components/Dashboard/Events/components/Actions';

const ShowEvent: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id;
  const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId);

  const { error, loading, event } = useSelector((state: AppStoreState) => ({
    error: state.events.error,
    loading: state.events.loading,
    event: state.events.events.find(
      event => event.id === parseInt(Array.isArray(id) ? id[0] : id),
    ),
  }));
  const { venue } = useSelector((state: AppStoreState) => ({
    venue: state.venues.venues.find(
      venue => event && venue.id === event.venue && event.venue !== undefined,
    ),
  }));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (!Number.isNaN(id)) {
      dispatch(eventActions.fetchEvent('1', id)).then(event => {
        if (event) {
          dispatch(venueActions.fetchOneVenue(event.venue));
          // TODO: Maybe combine this and the fetchEvent into one
          dispatch(eventActions.fetchRSVPS(1, id));
        }
      });
    }
  }, [id]);

  if ((loading && !event) || error || !event) {
    return (
      <Layout>
        <Skeleton>
          <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        </Skeleton>
      </Layout>
    );
  }

  return (
    <Layout>
      <Skeleton>
        <Card style={{ marginTop: '12px' }}>
          <ProgressCardContent loading={loading && !event}>
            <Typography gutterBottom variant="h5" component="h2">
              {event.name}
            </Typography>
            {event.canceled && (
              <Typography variant="h5" color="error">
                Canceled
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" component="p">
              {event.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {event.capacity}
            </Typography>
            <Tags tags={event.tags} />

            <Actions
              event={event}
              onDelete={() => router.replace('/dashboard/events')}
            />

            <h2>Venue:</h2>
            {venue && (
              <>
                <h1 style={{ padding: 0 }}>{venue.name}</h1>
                {venue.location && (
                  <h4>{getLocationString(venue.location, true)}</h4>
                )}
              </>
            )}
          </ProgressCardContent>
        </Card>
        <Card style={{ marginTop: '12px' }}>
          <CardContent>
            <h2>RSVPs:</h2>
            {event.rsvps ? (
              event.rsvps.loading ? (
                <h3>Loading...</h3>
              ) : event.rsvps.error ? (
                <h3>Error...</h3>
              ) : (
                <div>
                  <ul>
                    {event.rsvps.rsvps
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
                    {event.rsvps.rsvps
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
              )
            ) : (
              <h3>No rsvps</h3>
            )}
          </CardContent>
        </Card>
      </Skeleton>
    </Layout>
  );
};

export default ShowEvent;
