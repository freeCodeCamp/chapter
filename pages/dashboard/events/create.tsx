import React from 'react';
import { useDispatch } from 'react-redux';
import { eventActions } from 'client/store/actions';
import EventsForm, { IEventFormData } from 'client/components/EventsForm';

const CreateEvent: React.FC = () => {
  const dispatch = useDispatch();

  const onSubmit = (data: IEventFormData) => {
    // TODO: REMOVE
    const HARD_CODE = { chapter: 1, venue: 1 };
    const eventData = { ...data, ...HARD_CODE };
    console.log(eventData);

    dispatch(eventActions.createEvent(eventData))
      .then((success: boolean) => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return <EventsForm onSubmit={onSubmit} />;
};

export default CreateEvent;
