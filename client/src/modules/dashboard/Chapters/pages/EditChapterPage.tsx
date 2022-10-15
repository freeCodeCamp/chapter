import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';

import {
  CreateChapterInputs,
  useDashboardChapterLazyQuery,
  useUpdateChapterMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import ChapterForm from '../components/ChapterForm';
import { NextPageWithLayout } from '../../../../pages/_app';

export const EditChapterPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { param: chapterId, isReady } = useParam('id');

  const [getChapter, { loading, error, data }] = useDashboardChapterLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapter();
  }, [isReady]);

  const [updateChapter] = useUpdateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const onSubmit = async (data: CreateChapterInputs) => {
    setLoadingUpdate(true);
    try {
      await updateChapter({
        variables: { chapterId, data: { ...data } },
      });
      await router.push('/dashboard/chapters');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const isLoading = loading || !isReady || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <ChapterForm
      data={data}
      loading={loadingUpdate}
      onSubmit={onSubmit}
      loadingText={'Saving Chapter Changes'}
      submitText={'Save Chapter Changes'}
    />
  );
};

EditChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
