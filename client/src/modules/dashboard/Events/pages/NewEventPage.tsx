import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { EventFormData } from '../components/EventFormUtils';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { useCreateEventMutation } from '../../../../generated/graphql';
import { EVENTS } from '../graphql/queries';

export const NewEventPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createEvent] = useCreateEventMutation({
    refetchQueries: [{ query: EVENTS }],
  });

  const onSubmit = async (data: EventFormData) => {
    // TODO: load chapter from url or something like that
    setLoading(true);

    try {
      const HARD_CODE = { chapterId: 1 };

      console.log(data.start_at);

      const eventData = {
        ...data,
        capacity: parseInt(String(data.capacity)),
        start_at: new Date(data.start_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        ...HARD_CODE,
        tags: undefined,
      };

      const event = await createEvent({
        variables: { data: { ...eventData } },
      });

      if (event.data) {
        router.replace(
          `/dashboard/events/[id]`,
          `/dashboard/events/${event.data.createEvent.id}`,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <EventForm
        loading={loading}
        onSubmit={onSubmit}
        submitText={'Add event'}
      />
    </Layout>
  );
};
