import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { locationActions } from '../../../../modules/dashboard/Events/components/node_modules/client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from '../../../../modules/dashboard/Dashboard/Events/node_modules/client/components';
import useThunkDispatch from '../../../../modules/dashboard/Events/components/node_modules/client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Locations/Skeleton';
import Layout from 'client/components/Dashboard/shared/Layout';

const ShowLocation: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { error, loading, location } = useSelector((state: AppStoreState) => ({
    error: state.locations.error,
    loading: state.locations.loading,
    location: state.locations.locations.find(
      location => location.id === parseInt(Array.isArray(id) ? id[0] : id),
    ),
  }));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(locationActions.fetchOneLocation(id));
    }
  }, [id]);

  if ((loading && !location) || error || !location) {
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
        <Card style={{ marginTop: '12px' }} key={`event-${location.id}`}>
          <ProgressCardContent loading={loading && !location}>
            <Typography gutterBottom variant="h5" component="h2">
              {location.address}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`${location.region}, ${location.country_code}, ${location.postal_code}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {location.address}
            </Typography>
          </ProgressCardContent>
        </Card>

        <h3>Placeholder for venues...</h3>
      </Skeleton>
    </Layout>
  );
};

export default ShowLocation;
