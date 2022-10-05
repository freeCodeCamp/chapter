import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';

import { useCreateChapterMutation } from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm, { ChapterFormData } from '../components/ChapterForm';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewChapterPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [createChapter] = useCreateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const onSubmit = async (data: ChapterFormData) => {
    setLoading(true);
    try {
      await createChapter({
        variables: { data: { ...data } },
      });
      router.replace('/dashboard/chapters');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChapterForm
      loading={loading}
      onSubmit={onSubmit}
      loadingText={'Adding Chapter'}
      submitText={'Add chapter'}
    />
  );
};

NewChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
