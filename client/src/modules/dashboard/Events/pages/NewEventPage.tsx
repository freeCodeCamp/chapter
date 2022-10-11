import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

import {
  useCreateEventMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData, parseEventData } from '../components/EventFormUtils';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { EVENTS } from '../graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewEventPage: NextPageWithLayout = () => {
  const { param: chapterId, isReady } = useParam('id');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createEvent] = useCreateEventMutation();

  const [publish] = useSendEventInviteMutation();

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);

    try {
      const { chapter_id } = data;
      const event = await createEvent({
        variables: { chapterId: chapter_id, data: parseEventData(data) },
        refetchQueries: [
          { query: CHAPTER, variables: { chapterId: chapter_id } },
          { query: EVENTS },
          { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
        ],
      });

      if (event.data) {
        publish({ variables: { eventId: event.data.createEvent.id } });
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

  if (!isReady) return <DashboardLoading loading={isReady} />;

  return (
    <>
      {isReady && (
        <EventForm
          loading={loading}
          onSubmit={onSubmit}
          submitText={'Add event'}
          loadingText={'Adding Event'}
          chapterId={chapterId}
        />
      )}
    </>
  );
};

NewEventPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
