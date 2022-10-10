import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';

import {
  useVenueLazyQuery,
  useUpdateVenueMutation,
  useChapterLazyQuery,
} from '../../../../generated/graphql';

import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { VENUES } from '../graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const EditVenuePage: NextPageWithLayout = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const router = useRouter();
  const { param: venueId, isReady: isVenueIdReady } = useParam('venueId');
  const { param: chapterId, isReady: isChapterIdReady } = useParam('id');

  const [
    getChapter,
    { loading: loadingChapter, data: chapterData, error: errorChapter },
  ] = useChapterLazyQuery({
    variables: { chapterId },
  });

  const [getVenue, { loading, error, data }] = useVenueLazyQuery({
    variables: { venueId },
  });

  const isReady = isVenueIdReady && isChapterIdReady;

  useEffect(() => {
    if (isReady) {
      getVenue();
      getChapter();
    }
  }, [isReady]);

  const [updateVenue] = useUpdateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    setLoadingUpdate(true);
    const { chapter_id, ...updateData } = data;
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      await updateVenue({
        variables: {
          venueId,
          chapterId: chapter_id,
          data: { ...updateData, latitude, longitude },
        },
      });
      await router.push('/dashboard/venues');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const isLoading = loading || loadingChapter || !isReady;
  const errors: Error[] = [];
  if (error) errors.push(error);
  if (errorChapter) errors.push(errorChapter);
  if (isLoading || errors.length)
    return <DashboardLoading loading={isLoading} errors={errors} />;

  return (
    <VenueForm
      data={data}
      chapterData={chapterData}
      loading={loadingUpdate}
      onSubmit={onSubmit}
      submitText={'Save Venue Changes'}
      chapterId={chapterId}
      loadingText={'Saving Venue Changes'}
    />
  );
};

EditVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout dataCy="edit-venue-page">{page}</Layout>;
};
