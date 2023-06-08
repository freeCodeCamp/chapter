import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useCreateChapterMutation } from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_CHAPTERS } from '../graphql/queries';
import { useAlert } from '../../../../hooks/useAlert';
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

export const NewChapterPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [createChapter] = useCreateChapterMutation({
    refetchQueries: [
      { query: CHAPTERS },
      { query: DASHBOARD_CHAPTERS },
      { query: meQuery },
      { query: userDownloadQuery },
      { query: userProfileQuery },
    ],
  });

  const addAlert = useAlert();

  const onSubmit = async (inputData: ChapterFormData) => {
    // ToDo: handle empty data differently
    const { data: chapterData, errors } = await createChapter({
      variables: { data: parseChapterData(inputData) },
    });
    if (errors) throw errors;
    if (chapterData) {
      await router.replace(
        `/dashboard/chapters/${chapterData.createChapter.id}`,
      );
      addAlert({
        title: `Chapter "${chapterData.createChapter.name}" created!`,
        status: 'success',
      });
      if (!chapterData.createChapter.has_calendar) {
        addAlert({
          title: 'Calendar for chapter was not created.',
          status: 'warning',
        });
      }
    }
  };

  return (
    <ChapterForm
      onSubmit={onSubmit}
      loadingText={'Adding Chapter'}
      submitText={'Add chapter'}
    />
  );
};

NewChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
