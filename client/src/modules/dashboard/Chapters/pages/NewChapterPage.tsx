import { NextPage } from 'next';

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCreateChapterMutation } from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm, { ChapterFormData } from '../components/ChapterForm';

export const NewChapterPage: NextPage = () => {
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
      router.replace(`/dashboard/chapters/${data.id}/new-venue`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ChapterForm
        loading={loading}
        onSubmit={onSubmit}
        loadingText={'Adding Chapter'}
        submitText={'Add chapter'}
      />
    </Layout>
  );
};
