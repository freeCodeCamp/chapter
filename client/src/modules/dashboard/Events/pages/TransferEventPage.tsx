import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { isFuture } from 'date-fns';

import {
  useCancelEventMutation,
  useCreateEventMutation,
  useDashboardEventQuery,
  useJoinChapterMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
import { useParam } from '../../../../hooks/useParam';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import EventForm from '../components/EventForm';
import { EventFormData, parseEventData } from '../components/EventFormUtils';
import { DASHBOARD_EVENTS, DASHBOARD_EVENT } from '../graphql/queries';
import {
  DATA_PAGINATED_EVENTS_TOTAL_QUERY,
  EVENT,
} from '../../../events/graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { NextPageWithLayout } from '../../../../pages/_app';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { useUser } from '../../../auth/user';

export const TransferEventPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: eventId } = useParam();
  const { user } = useUser();

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId: eventId },
  });

  const addAlert = useAlert();

  // TODO: update the cache directly:
  // https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly
  const [cancelEvent] = useCancelEventMutation({
    refetchQueries: [
      { query: DASHBOARD_EVENTS },
      { query: EVENT, variables: { eventId } },
      { query: DASHBOARD_EVENT, variables: { eventId } },
      {
        query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
        variables: { offset: 0, limit: 2 },
      },
      {
        query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
        variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
      },
    ],
  });
  const [createEvent] = useCreateEventMutation();
  const [joinChapter] = useJoinChapterMutation();
  const [publish] = useSendEventInviteMutation();

  const onSubmit = async (data: EventFormData) => {
    const { chapter_id, attend_event } = data;
    const { data: cancelData, errors: cancelErrors } = await cancelEvent({
      variables: { eventId },
    });

    if (cancelErrors) throw cancelErrors;

    const { data: createData, errors: createErrors } = await createEvent({
      variables: {
        chapterId: chapter_id,
        data: parseEventData(data),
        attendEvent: attend_event ?? false,
      },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter_id } },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 2 },
        },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
        },
        {
          query: DASHBOARD_EVENTS,
        },
      ],
    });

    if (createErrors) throw createErrors;

    if (cancelData && createData) {
      if (attend_event) joinChapter({ variables: { chapterId: chapter_id } });
      if (isFuture(data.start_at)) {
        await publish({ variables: { eventId: createData.createEvent.id } });
      }
      await router.replace(
        `/dashboard/events/[id]`,
        `/dashboard/events/${createData.createEvent.id}`,
      );
      addAlert({
        title: `Event "${createData.createEvent.name}" transferred successfully!`,
        status: 'success',
      });

      const hasChapterCalendar = user?.admined_chapters.find(
        ({ id }) => id === chapter_id,
      )?.has_calendar;
      if (hasChapterCalendar && !createData.createEvent.has_calendar_event) {
        addAlert({
          title: 'Calendar event was not created.',
          status: 'warning',
        });
      }
    }
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardEvent)
    return <NextError statusCode={404} title="Event not found" />;

  const { sponsors, ...rest } = data.dashboardEvent;
  const sponsorData = sponsors?.map((s) => {
    return {
      id: s.sponsor.id,
      type: s.sponsor.type,
    };
  });
  return (
    <EventForm
      chapter={data.dashboardEvent.chapter}
      data={{
        ...rest,
        sponsors: sponsorData || [],
        venue_id: data.dashboardEvent?.venue?.id,
      }}
      formType="transfer"
      header="Transfer Event"
      loadingText="Transfering Event"
      onSubmit={onSubmit}
      submitText="Transfer Event"
    />
  );
};

TransferEventPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
