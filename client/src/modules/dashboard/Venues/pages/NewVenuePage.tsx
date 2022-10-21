import NextError from 'next/error';
import React, { ReactElement } from 'react';

import { Layout } from '../../shared/components/Layout';
import VenueForm from '../components/VenueForm';

import { NextPageWithLayout } from '../../../../pages/_app';
import { useSubmitVenue } from '../utils';
import { useAuth } from 'modules/auth/store';

export const NewVenuePage: NextPageWithLayout = () => {
  const { user } = useAuth();

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
  return <Layout>{page}</Layout>;
};
