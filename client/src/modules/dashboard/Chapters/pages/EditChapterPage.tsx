import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  useChapterQuery,
  useUpdateChapterMutation,
} from '../../../../generated/graphql';
import { getId } from '../../../../util/getId';
import styles from '../../../../styles/Page.module.css';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm, { ChapterFormData } from '../components/ChapterForm';

export const EditChapterPage: NextPage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const router = useRouter();
  const id = getId(router.query) || -1;

  const { loading, error, data } = useChapterQuery({ variables: { id } });
  const [updateChapter] = useUpdateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const onSubmit = async (data: ChapterFormData) => {
    setLoadingUpdate(true);
    try {
      await updateChapter({
        variables: { id, data: { ...data } },
      });
      await router.push('/dashboard/chapters');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
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
        submitText={'Save Chapter Changes'}
      />
    </Layout>
  );
};
