import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import {
  useChapterLazyQuery,
  useUpdateChapterMutation,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm, { ChapterFormData } from '../components/ChapterForm';

export const EditChapterPage: NextPage = () => {
  const router = useRouter();
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { param: chapterId, isReady } = useParam('id');

  const [getChapter, { loading, error, data }] = useChapterLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapter();
  }, [isReady]);

  const [updateChapter] = useUpdateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const onSubmit = async (data: ChapterFormData) => {
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

  if (loading || !isReady || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading || !isReady ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

  return (
    <Layout>
      <ChapterForm
        data={data}
        loading={loadingUpdate}
        onSubmit={onSubmit}
        loadingText={'Saving Chapter Changes'}
        submitText={'Save Chapter Changes'}
      />
    </Layout>
  );
};
