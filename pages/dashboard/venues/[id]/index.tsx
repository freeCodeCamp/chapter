import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { venueActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from 'client/components';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Venues/Skeleton';

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

  if (loading || error || !venue) {
    return (
      <Skeleton>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
      </Skeleton>
    );
  }

  return (
    <Skeleton>
      <Card style={{ marginTop: '12px' }} key={`event-${venue.id}`}>
        <ProgressCardContent loading={loading}>
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
  );
};

export default ShowVenue;
