import NextError from 'next/error';
import React, { ReactElement } from 'react';

import { useDashboardEventQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import EventForm from '../components/EventForm';
import { EventFormData } from '../components/EventFormUtils';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useCancelEvent } from 'hooks/useCancelEvent';
import { useCreateEvent } from 'hooks/useCreateEvent';

export const TransferEventPage: NextPageWithLayout = () => {
  const { param: eventId } = useParam();

  const { loading, error, data } = useDashboardEventQuery({
    variables: { eventId: eventId },
  });

  const cancelEvent = useCancelEvent();
  const createEvent = useCreateEvent();

  const onSubmit = async (data: EventFormData) => {
    const cancelData = await cancelEvent({ eventId });

    if (cancelData) {
      await createEvent({
        data,
        success: (eventName) =>
          `Event "${eventName}" transferred successfully!`,
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
