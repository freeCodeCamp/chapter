import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useToast } from '@chakra-ui/react';

import {
  useDashboardEventQuery,
  useUpdateEventMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData, parseEventData } from '../components/EventFormUtils';
import { DASHBOARD_EVENTS, DASHBOARD_EVENT } from '../graphql/queries';
import { EVENT } from '../../../events/graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { NextPageWithLayout } from '../../../../pages/_app';

export const EditEventPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: eventId } = useParam();

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId: eventId },
  });

  const toast = useToast();

  // TODO: update the cache directly:
  // https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly
  const [updateEvent] = useUpdateEventMutation({
    refetchQueries: [
      { query: DASHBOARD_EVENTS, variables: { showCanceled: true } },
      { query: DASHBOARD_EVENTS, variables: { showCanceled: false } },
      { query: EVENT, variables: { eventId } },
      { query: DASHBOARD_EVENT, variables: { eventId } },
      { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
    ],
  });

  const onSubmit = async (data: EventFormData) => {
    const { data: eventData, errors } = await updateEvent({
      variables: { eventId, data: parseEventData(data) },
    });

    if (errors) throw errors;

    if (eventData) {
      await router.push('/dashboard/events');
      toast({
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
      data={{
        ...rest,
        sponsors: sponsorData || [],
        venue_id: data.dashboardEvent?.venue?.id,
      }}
      onSubmit={onSubmit}
      loadingText={'Saving Event Changes'}
      submitText={'Save Event Changes'}
      chapterId={data.dashboardEvent.chapter.id}
      formType="edit"
    />
  );
};

EditEventPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
