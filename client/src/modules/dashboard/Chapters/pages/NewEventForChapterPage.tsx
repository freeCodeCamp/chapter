import React from 'react';

import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';
import { NewEventPage } from '../../Events/pages/NewEventPage';

export const NewEventForChapterPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');

  return <NewEventPage chapterId={chapterId} />;
};
