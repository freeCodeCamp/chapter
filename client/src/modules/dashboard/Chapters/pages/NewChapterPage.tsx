import { useToast } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import {
  CreateChapterInputs,
  useCreateChapterMutation,
} from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { DASHBOARD_CHAPTERS } from '../graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm from '../components/ChapterForm';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewChapterPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [createChapter] = useCreateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }, { query: DASHBOARD_CHAPTERS }],
  });

  const toast = useToast();

  const onSubmit = async (inputData: CreateChapterInputs) => {
    // ToDo: handle empty data differently
    const { data: chapterData, errors } = await createChapter({
      variables: { data: { ...inputData } },
    });
    if (errors) throw errors;
    if (chapterData) {
      await router.replace(
        `/dashboard/chapters/${chapterData.createChapter.id}/new-venue`,
      );
      toast({
        title: `Chapter "${chapterData.createChapter.name}" created!`,
        status: 'success',
      });
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
  return <Layout>{page}</Layout>;
};
