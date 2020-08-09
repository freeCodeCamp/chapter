import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

import { IEventFormData } from '../components/EventFormUtils';
import Layout from '../../shared/components/Layout';
import Skeleton from '../../Venues/components/Skeleton';
import EventForm from '../components/EventForm';
import { useCreateEventMutation, useEventQuery } from '../../../../generated';
import { EVENTS } from '../graphql/queries';
import { getId } from '../../../../helpers/getId';

export const EditEventPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const id = getId(router.query) || -1;

  const { loading: eventLoading, error, data } = useEventQuery({
    variables: { id },
  });

  const [createEvent] = useCreateEventMutation({
    refetchQueries: [{ query: EVENTS }],
  });

  const onSubmit = async (data: IEventFormData) => {
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

  if (eventLoading || error || !data?.event) {
    return (
      <Layout>
        <Skeleton>
          <h1>{loading ? 'Loading...' : 'Error...'}</h1>
          {error && <div>{error}</div>}
        </Skeleton>
      </Layout>
    );
  }

  return (
    <Layout>
      <Skeleton>
        <EventForm
          data={{
            ...data.event,
            venueId: data.event.venue.id,
            tags: data.event.tags || [],
          }}
          loading={loading}
          onSubmit={onSubmit}
          submitText={'Update event'}
        />
      </Skeleton>
    </Layout>
  );
};
