import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  useEventQuery,
  useUpdateEventMutation,
} from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData } from '../components/EventFormUtils';
import { EVENTS } from '../graphql/queries';

export const EditEventPage: NextPage = () => {
  const router = useRouter();
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const id = getId(router.query) || -1;

  const {
    loading: eventLoading,
    error,
    data,
  } = useEventQuery({
    variables: { id },
  });

  const [updateEvent] = useUpdateEventMutation({
    refetchQueries: [{ query: EVENTS }],
  });

  const onSubmit = async (data: EventFormData) => {
    // TODO: load chapter from url or something like that
    setLoadingUpdate(true);

    try {
      const eventData = {
        ...data,
        capacity: parseInt(String(data.capacity)),
        venueId: parseInt(String(data.venueId)),
        start_at: new Date(data.start_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        tags: undefined,
      };

      const event = await updateEvent({
        variables: { id, data: { ...eventData } },
      });

      if (event.data) {
        await router.push('/dashboard/events');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (eventLoading || error || !data?.event) {
    return (
      <Layout>
        <h1>{loadingUpdate ? 'Loading...' : 'Error...'}</h1>
        {error && <div>{error}</div>}
      </Layout>
    );
  }

  return (
    <Layout>
      <EventForm
        data={{
          ...data.event,
          venueId: data.event?.venue?.id,
          tags: data.event.tags || [],
        }}
        loading={loadingUpdate}
        onSubmit={onSubmit}
        submitText={'Save Event Changes'}
      />
    </Layout>
  );
};
