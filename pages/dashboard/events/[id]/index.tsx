import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { eventActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { ProgressCardContent } from 'client/components';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Events/Skeleton';

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
  const dispatch = useThunkDispatch();

  console.log(parseInt(Array.isArray(id) ? id[0] : id));

  useEffect(() => {
    if (id !== undefined) {
      dispatch(eventActions.fetchEvent('1', id));
    }
  }, [id]);

  if (loading || error || !event) {
    return (
      <Skeleton>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
      </Skeleton>
    );
  }

  return (
    <Skeleton>
      <Card style={{ marginTop: '12px' }}>
        <ProgressCardContent loading={loading}>
          <Typography gutterBottom variant="h5" component="h2">
            {event.name}
          </Typography>
        </ProgressCardContent>
      </Card>
    </Skeleton>
  );
};

export default ShowEvent;
