import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  useCreateEventMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData } from '../components/EventFormUtils';
import { EVENTS } from '../graphql/queries';

export const NewEventPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createEvent] = useCreateEventMutation({
    refetchQueries: [{ query: EVENTS }],
  });

  const [publish] = useSendEventInviteMutation();

  const onSubmit = async (data: EventFormData) => {
    // TODO: load chapter from url or something like that
    setLoading(true);

    try {
      const HARD_CODE = { chapterId: 1 };
      const { sponsors, ...rest } = data;
      const sponsorArray = sponsors.map((s) => parseInt(String(s.id)));
      const eventData = {
        ...rest,
        capacity: parseInt(String(data.capacity)),
        venueId: parseInt(String(data.venueId)),
        start_at: new Date(data.start_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        ...HARD_CODE,
        tags: undefined,
        sponsorIds: sponsorArray,
      };
      const event = await createEvent({
        variables: { data: { ...eventData } },
      });

      if (event.data) {
        publish({ variables: { id: event.data.createEvent.id } });
        router.replace(
          `/dashboard/events/[id]`,
          `/dashboard/events/${event.data.createEvent.id}`,
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
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
