import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import {
  useDashboardChapterQuery,
  useUpdateChapterMutation,
} from '../../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
import { useParam } from '../../../../hooks/useParam';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_CHAPTER, DASHBOARD_CHAPTERS } from '../graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import ChapterForm from '../components/ChapterForm';
import { NextPageWithLayout } from '../../../../pages/_app';
import { meQuery } from '../../../auth/graphql/queries';
import {
  userDownloadQuery,
  userProfileQuery,
} from '../../../profiles/graphql/queries';
import {
  ChapterFormData,
  parseChapterData,
} from '../components/ChapterFormUtils';

export const EditChapterPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: chapterId } = useParam('id');

  const { loading, error, data } = useDashboardChapterQuery({
    variables: { chapterId },
  });

  const [updateChapter] = useUpdateChapterMutation({
    refetchQueries: [
      { query: CHAPTERS },
      { query: DASHBOARD_CHAPTER, variables: { chapterId } },
      { query: DASHBOARD_CHAPTERS },
      { query: meQuery },
      { query: userDownloadQuery },
      { query: userProfileQuery },
    ],
  });

  const addAlert = useAlert();

  const onSubmit = async (data: ChapterFormData) => {
    const { data: chapterData, errors } = await updateChapter({
      variables: { chapterId, data: parseChapterData(data) },
    });
    if (errors) throw errors;
    if (chapterData) {
      await router.push('/dashboard/chapters');
      addAlert({
        title: `Chapter "${chapterData.updateChapter.name}" updated successfully!`,
        status: 'success',
      });
    }
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <ChapterForm
      data={data}
      onSubmit={onSubmit}
      loadingText={'Saving Chapter Changes'}
      submitText={'Save Chapter Changes'}
    />
  );
};

EditChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
