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
import { useParam } from '../../../../hooks/useParam';

export const NewEventPage: NextPage = () => {
  const chapterId = useParam('id');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createEvent] = useCreateEventMutation({
    refetchQueries: [{ query: EVENTS }],
  });

  const [publish] = useSendEventInviteMutation();

  const onSubmit = async (data: EventFormData, chapterId: number) => {
    setLoading(true);

    try {
      const { sponsors, tags, ...rest } = data;
      const sponsorArray = sponsors.map((s) => parseInt(String(s.id)));
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const eventData = {
        ...rest,
        capacity: parseInt(String(data.capacity)),
        venue_id: parseInt(String(data.venue_id)),
        start_at: new Date(data.start_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        tags: tagsArray,
        sponsor_ids: sponsorArray,
        chapter_id: chapterId,
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
        chapterId={chapterId}
      />
    </Layout>
  );
};
