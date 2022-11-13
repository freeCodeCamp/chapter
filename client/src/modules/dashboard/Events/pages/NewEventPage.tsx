import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { isFuture } from 'date-fns';

import {
  useCreateEventMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData, parseEventData } from '../components/EventFormUtils';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENTS } from '../graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewEventPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');
  const router = useRouter();

  const [createEvent] = useCreateEventMutation();

  const [publish] = useSendEventInviteMutation();

  const toast = useToast();

  const onSubmit = async (data: EventFormData) => {
    const { chapter_id } = data;
    const { data: eventData, errors } = await createEvent({
      variables: { chapterId: chapter_id, data: parseEventData(data) },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter_id } },
        { query: DASHBOARD_EVENTS },
        { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
      ],
    });

    if (errors) throw errors;

    if (eventData) {
      if (isFuture(data.start_at)) {
        await publish({ variables: { eventId: eventData.createEvent.id } });
      }
      await router.replace(
        `/dashboard/events/[id]`,
        `/dashboard/events/${eventData.createEvent.id}`,
      );
      toast({
        title: `Event "${eventData.createEvent.name}" created!`,
        status: 'success',
      });
    }
  };

  return (
    <EventForm
      onSubmit={onSubmit}
      submitText={'Add event'}
      loadingText={'Adding Event'}
      chapterId={chapterId}
    />
  );
};

NewEventPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
