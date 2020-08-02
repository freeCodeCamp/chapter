import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';

import {
  eventActions,
  venueActions,
} from '../../../../modules/dashboard/Events/components/node_modules/client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import useThunkDispatch from '../../../../modules/dashboard/Events/components/node_modules/client/hooks/useThunkDispatch';
import Skeleton from 'client/components/Dashboard/Events/Skeleton';
import { EventForm } from 'client/components/Dashboard/Events';
import Layout from 'client/components/Dashboard/shared/Layout';
import { IEventFormData } from 'client/components/Dashboard/Events/EventFormUtils';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

const EditEvent: React.FC = () => {
  const router = useRouter();
  const rawId = router.query.id || '';
  const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId);
  const styles = useStyles();

  const { error, loading, event, venues, venuesLoading } = useSelector(
    (state: AppStoreState) => ({
      error: state.events.error,
      loading: state.events.loading,
      event: state.events.events.find(event => event.id === id),
      venues: state.venues.venues,
      venuesLoading: state.venues.loading,
    }),
  );
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (!Number.isNaN(id)) {
      dispatch(eventActions.fetchEvent('1', id));
      dispatch(venueActions.fetchVenues());
    }
  }, [id]);

  const onSubmit = async (data: IEventFormData) => {
    let add: string[] = [];
    let remove: number[] = [];

    if (event) {
      if (event.tags !== undefined) {
        const tags = Array.from(
          new Set(data.tags.split(',').map(item => item.trim())),
        );

        add = tags.filter(item => {
          if (event && event.tags) {
            return event.tags.findIndex(tag => tag.name === item) === -1;
          }
        });
        remove = event.tags
          .filter(tag => !tags.includes(tag.name))
          .map(tag => tag.id);
      }
    }

    const submitData = {
      ...data,
      tags: {
        add,
        remove,
      },
    };

    const success = await dispatch(eventActions.updateEvent(id, submitData));

    if (success) {
      router.replace('/dashboard/events');
    }
  };

  return (
    <Layout>
      <Skeleton>
        {(loading && !event) || error || !event ? (
          <>
            <h1>{loading ? 'Loading...' : 'Error...'}</h1>
            {error && <div className={styles.responseDiv}>{error}</div>}
          </>
        ) : (
          <EventForm
            loading={loading && !event}
            onSubmit={onSubmit}
            data={event}
            venues={venues}
            venuesLoading={venuesLoading}
            submitText={'Update event'}
          />
        )}
      </Skeleton>
    </Layout>
  );
};

export default EditEvent;
