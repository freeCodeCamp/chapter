import NextError from 'next/error';
import React, { ReactElement } from 'react';

import { DashboardLayout } from '../../shared/components/DashboardLayout';
import VenueForm from '../components/VenueForm';

import { NextPageWithLayout } from '../../../../pages/_app';
import { useSubmitVenue } from '../utils';
import { useUser } from '../../../auth/user';

export const NewVenuePage: NextPageWithLayout = () => {
  const { user } = useUser();

  const onSubmit = useSubmitVenue();

  if (!user) return <NextError statusCode={403} title="Log in required" />;

  return (
    <VenueForm
      adminedChapters={user.admined_chapters}
      onSubmit={onSubmit}
      submitText={'Add venue'}
      loadingText={'Adding venue'}
    />
  );
};

NewVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
