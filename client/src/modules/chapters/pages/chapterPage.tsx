import React from 'react';
import { NextPage } from 'next';
import { useParam } from 'hooks/useParam';
import { useChapterQuery } from 'generated/graphql';

export const ChapterPage: NextPage = () => {
  const id = useParam('chapterId');

  const { loading, error, data } = useChapterQuery({
    variables: { id: id || -1 },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !data?.chapter) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>{data?.chapter.name}</h1>
    </div>
  );
};
