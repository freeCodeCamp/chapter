import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';

import {
  useChapterLazyQuery,
  useCreateVenueMutation,
} from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { VENUES } from '../graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const ChapterNewVenuePage: NextPageWithLayout = () => {
  const { param: chapterId, isReady } = useParam('id');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const [getChapter, { data, error }] = useChapterLazyQuery();

  useEffect(() => {
    if (isReady) {
      getChapter({ variables: { chapterId } });
    }
  }, [isReady]);

  const onSubmit = async (data: VenueFormData) => {
    setLoading(true);
    const { chapter_id, ...createData } = data;
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      const venue = await createVenue({
        variables: {
          chapterId: chapter_id,
          data: { ...createData, latitude, longitude },
        },
      });
      if (venue.data) {
        router.replace(`/dashboard/venues/${venue.data.createVenue.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || !data || !isReady;

  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <VenueForm
      loading={loading}
      chapterData={data}
      onSubmit={onSubmit}
      submitText={'Add venue'}
      chapterId={chapterId}
      loadingText={'Adding venue'}
    />
  );
};

ChapterNewVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
