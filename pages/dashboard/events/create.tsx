import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventActions } from 'client/store/actions';
import EventsForm, { IEventFormData } from 'client/components/EventsForm';
import { AppStoreState } from 'client/store/reducers';
import { useRouter } from 'next/router';

const CreateEvent: React.FC = () => {
  const { error, state } = useSelector((state: AppStoreState) => ({
    error: state.events.create.error,
    state: state.events.create.state,
  }));
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = (data: IEventFormData) => {
    // TODO: REMOVE and add selector for venue
    // load chapter from url or something like that
    const HARD_CODE = { chapter: 1, venue: 1 };
    const eventData = { ...data, ...HARD_CODE };
    console.log(eventData);

    dispatch(eventActions.createEvent(eventData)).then((success: boolean) => {
      if (success) {
        router.replace('/dashboard/events');
      }
    });
  };

  return (
    <>
      {error && <div>{JSON.stringify(error)}</div>}
      <EventsForm loading={state === 'loading'} onSubmit={onSubmit} />
    </>
  );
};

export default CreateEvent;
