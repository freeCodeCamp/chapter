import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { eventActions, venueActions } from 'client/store/actions';
import EventForm, {
  IEventFormData,
} from 'client/components/Dashboard/Events/EventForm';
import { AppStoreState } from 'client/store/reducers';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import { Skeleton } from 'client/components/Dashboard/Events';

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

    dispatch(eventActions.createEvent(eventData)).then((success: boolean) => {
      if (success) {
        router.replace('/dashboard/events');
      }
    });
  };

  useEffect(() => {
    dispatch(venueActions.fetchVenues());
  }, []);

  return (
    <Skeleton>
      {error && <div>{JSON.stringify(error)}</div>}
      <EventForm
        loading={state === 'loading'}
        venuesLoading={venuesLoading}
        venues={venues}
        onSubmit={onSubmit}
      />
    </Skeleton>
  );
};

export default CreateEvent;
