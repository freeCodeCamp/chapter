import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import {
  useDashboardEventQuery,
  useUpdateEventMutation,
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

export const EditEventPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: eventId } = useParam();

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId: eventId },
  });

  const addAlert = useAlert();

  // TODO: update the cache directly:
  // https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly
  const [updateEvent] = useUpdateEventMutation({
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

  const onSubmit = async (data: EventFormData) => {
    const { data: eventData, errors } = await updateEvent({
      variables: { eventId, data: parseEventData(data) },
    });

    if (errors) throw errors;

    if (eventData) {
      await router.push('/dashboard/events');
      addAlert({
        title: `Event "${eventData.updateEvent.name}" updated successfully!`,
        status: 'success',
      });
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
      formType="edit"
      header="Edit Event"
      loadingText={'Saving Event Changes'}
      onSubmit={onSubmit}
      submitText={'Save Event Changes'}
    />
  );
};

EditEventPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
