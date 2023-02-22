import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { isFuture } from 'date-fns';

import {
  useCreateEventMutation,
  useDashboardChapterQuery,
  useJoinChapterMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import EventForm from '../components/EventForm';
import { EventFormData, parseEventData } from '../components/EventFormUtils';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { DASHBOARD_EVENTS } from '../graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewEventPage: NextPageWithLayout<{
  chapterId?: number;
}> = ({ chapterId }) => {
  const router = useRouter();

  const [createEvent] = useCreateEventMutation();

  const [publish] = useSendEventInviteMutation();

  const toast = useToast();

  const [joinChapter] = useJoinChapterMutation();

  const displayChaptersDropdown = typeof chapterId === 'undefined';
  const queryOptions = displayChaptersDropdown
    ? { skip: true }
    : { variables: { chapterId } };

  const chapterQuery = useDashboardChapterQuery(queryOptions);
  const { data: chapterData, refetch } = chapterQuery;

  const onSubmit = async (data: EventFormData) => {
    const { chapter_id, attend_event } = data;
    const { data: eventData, errors } = await createEvent({
      variables: {
        chapterId: chapter_id,
        data: parseEventData(data),
        attendEvent: attend_event ?? false,
      },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter_id } },
        { query: DASHBOARD_EVENTS, variables: { showCanceled: true } },
        { query: DASHBOARD_EVENTS, variables: { showCanceled: false } },
        { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
      ],
    });

    if (errors) throw errors;

    if (eventData) {
      if (attend_event) joinChapter({ variables: { chapterId: chapter_id } });
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

      let hasChapterCalendar = chapterData?.dashboardChapter.has_calendar;
      if (chapter_id !== chapterId) {
        const { data: currentChapter } = await refetch({
          chapterId: chapter_id,
        });
        hasChapterCalendar = currentChapter.dashboardChapter.has_calendar;
      }
      if (hasChapterCalendar && !eventData.createEvent.has_calendar_event) {
        toast({ title: 'Calendar event was not created.', status: 'warning' });
      }
    }
  };

  return (
    <EventForm
      onSubmit={onSubmit}
      submitText="Add event"
      loadingText="Adding Event"
      chapterId={chapterId}
      formType="new"
      chapterQuery={chapterQuery}
      displayChaptersDropdown={displayChaptersDropdown}
    />
  );
};

NewEventPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
