import React, { ReactElement } from 'react';

import { useChapterQuery } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import VenueForm from '../components/VenueForm';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useSubmitVenue } from '../utils';

export const ChapterNewVenuePage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');

  const { loading, data, error } = useChapterQuery({
    variables: { chapterId },
  });

  const onSubmit = useSubmitVenue();

  const isLoading = loading || !data;

  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <VenueForm
      chapterData={data}
      onSubmit={onSubmit}
      submitText={'Add venue'}
      chapterId={chapterId}
      loadingText={'Adding venue'}
    />
  );
};

ChapterNewVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
