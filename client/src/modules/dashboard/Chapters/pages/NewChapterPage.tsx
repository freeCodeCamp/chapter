import React, { useState } from 'react';
import { NextPage } from 'next';

import { Layout } from '../../shared/components/Layout';
import ChapterForm, { ChapterFormData } from '../components/ChapterForm';
import { useRouter } from 'next/router';
import { useCreateChapterMutation } from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';

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
      router.replace('/dashboard/chapters');
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
        submitText={'Add chapter'}
      />
    </Layout>
  );
};
