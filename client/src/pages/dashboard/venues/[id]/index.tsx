import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { venueActions } from '../../../../modules/dashboard/Events/components/node_modules/client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from '../../../../modules/dashboard/Dashboard/Events/node_modules/client/components';
import useThunkDispatch from '../../../../modules/dashboard/Events/components/node_modules/client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Venues/Skeleton';
import Layout from 'client/components/Dashboard/shared/Layout';

const ShowVenue: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { error, loading, venue } = useSelector((state: AppStoreState) => ({
    error: state.venues.error,
    loading: state.venues.loading,
    venue: state.venues.venues.find(
      venue => venue.id === parseInt(Array.isArray(id) ? id[0] : id),
    ),
  }));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(venueActions.fetchOneVenue(id));
    }
  }, [id]);

  if ((loading && !venue) || error || !venue) {
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
        <Card style={{ marginTop: '12px' }} key={`event-${venue.id}`}>
          <ProgressCardContent loading={loading && !venue}>
            <Typography gutterBottom variant="h5" component="h2">
              {venue.name}
            </Typography>
            {venue.location && (
              <Typography variant="body2" color="textSecondary" component="p">
                {`${venue.location.region}, ${venue.location.country_code}, ${venue.location.postal_code}`}
              </Typography>
            )}
          </ProgressCardContent>
        </Card>

        <h3>Placeholder for venues...</h3>
      </Skeleton>
    </Layout>
  );
};

export default ShowVenue;
