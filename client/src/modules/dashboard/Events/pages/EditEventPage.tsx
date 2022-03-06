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
import { EVENTS, EVENT } from '../graphql/queries';

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

  // TODO: update the cache directly:
  // https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly
  const [updateEvent] = useUpdateEventMutation({
    refetchQueries: [{ query: EVENTS }, { query: EVENT, variables: { id } }],
  });

  const onSubmit = async (data: EventFormData) => {
    // TODO: load chapter from url or something like that
    setLoadingUpdate(true);

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
  const { sponsors, ...rest } = data.event;
  const sponsorData = sponsors?.map((s) => {
    return {
      id: s.sponsor.id,
      type: s.sponsor.type,
    };
  });
  return (
    <Layout>
      <EventForm
        data={{
          ...rest,
          sponsors: sponsorData || [],
          venue_id: data.event?.venue?.id,
          tags: data.event.tags || [],
        }}
        loading={loadingUpdate}
        onSubmit={onSubmit}
        submitText={'Save Event Changes'}
      />
    </Layout>
  );
};
