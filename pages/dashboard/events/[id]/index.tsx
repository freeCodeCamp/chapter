import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { eventActions, venueActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from 'client/components';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Events/Skeleton';
import Layout from 'client/components/Dashboard/shared/Layout';
import Tags from 'client/components/Dashboard/Events/components/Tag';
import getLocationString from 'client/helpers/getLocationString';

const ShowEvent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

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

  console.log(parseInt(Array.isArray(id) ? id[0] : id));

  useEffect(() => {
    if (id !== undefined) {
      dispatch(eventActions.fetchEvent('1', id)).then(event => {
        if (event) {
          dispatch(venueActions.fetchOneVenue(event.venue));
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

            {venue && (
              <>
                <h1>{venue.name}</h1>
                {venue.location && (
                  <h4>{getLocationString(venue.location, true)}</h4>
                )}
              </>
            )}
          </ProgressCardContent>
        </Card>
      </Skeleton>
    </Layout>
  );
};

export default ShowEvent;
