import React, { ReactElement, useEffect } from 'react';

import { useChapterLazyQuery } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm from '../components/VenueForm';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useSubmitVenue } from '../utils';

export const ChapterNewVenuePage: NextPageWithLayout = () => {
  const { param: chapterId, isReady } = useParam('id');

  const [getChapter, { data, error }] = useChapterLazyQuery();

  useEffect(() => {
    if (isReady) {
      getChapter({ variables: { chapterId } });
    }
  }, [isReady]);

  const onSubmit = useSubmitVenue();

  const isLoading = !data || !isReady;

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
  return <Layout>{page}</Layout>;
};
