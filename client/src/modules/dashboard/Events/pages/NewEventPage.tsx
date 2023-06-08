import NextError from 'next/error';
import React, { ReactElement } from 'react';

import { DashboardLayout } from '../../shared/components/DashboardLayout';
import EventForm from '../components/EventForm';
import { EventFormData } from '../components/EventFormUtils';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useUser } from '../../../auth/user';
import { useCreateEvent } from '../../../../hooks/useCreateEvent';

export const NewEventPage: NextPageWithLayout<{
  chapterId?: number;
}> = ({ chapterId }) => {
  const createEvent = useCreateEvent();

  const { user } = useUser();
  const chapter = user?.admined_chapters.find(({ id }) => id === chapterId);
  if ((chapterId && !chapter) || !user?.admined_chapters.length) {
    return <NextError statusCode={403} title="Access denied" />;
  }

  const onSubmit = async (data: EventFormData) =>
    await createEvent({
      data,
      success: (eventName) => `Event "${eventName}" created!`,
    });

  return (
    <EventForm
      chapter={chapter}
      formType="new"
      header="Create Event"
      loadingText="Adding Event"
      onSubmit={onSubmit}
      submitText="Add event"
    />
  );
};

NewEventPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
