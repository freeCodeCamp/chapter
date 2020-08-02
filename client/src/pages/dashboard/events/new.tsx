import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { eventActions, venueActions } from 'client/store/actions';
import EventForm from 'client/components/Dashboard/Events/EventForm';
import { IEventFormData } from 'client/components/Dashboard/Events/EventFormUtils';
import { AppStoreState } from 'client/store/reducers';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import { Skeleton } from 'client/components/Dashboard/Events';
import Layout from 'client/components/Dashboard/shared/Layout';

const CreateEvent: React.FC = () => {
  const { error, state, venues, venuesLoading } = useSelector(
    (state: AppStoreState) => ({
      error: state.events.create.error,
      state: state.events.create.state,
      venues: state.venues.venues,
      venuesLoading: state.venues.loading,
    }),
  );
  const dispatch = useThunkDispatch();
  const router = useRouter();

  const onSubmit = (data: IEventFormData) => {
    // TODO: load chapter from url or something like that

    const HARD_CODE = { chapter: 1 };
    const eventData = { ...data, ...HARD_CODE };

    dispatch(eventActions.createEvent(eventData)).then(({ success, id }) => {
      if (success && id) {
        router.replace(`/dashboard/events/[id]`, `/dashboard/events/${id}`);
      }
    });
  };

  useEffect(() => {
    dispatch(venueActions.fetchVenues());
  }, []);

  return (
    <Layout>
      <Skeleton>
        {error && <div>{JSON.stringify(error)}</div>}
        <EventForm
          loading={state === 'loading'}
          venuesLoading={venuesLoading}
          venues={venues}
          onSubmit={onSubmit}
          submitText={'Add event'}
        />
      </Skeleton>
    </Layout>
  );
};

export default CreateEvent;
