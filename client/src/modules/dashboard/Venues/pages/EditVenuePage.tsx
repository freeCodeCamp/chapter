import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';

import {
  useVenueLazyQuery,
  useUpdateVenueMutation,
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

  const isReady = isVenueIdReady && isChapterIdReady;

  const [getVenue, { loading, error, data }] = useVenueLazyQuery({
    variables: { venueId },
  });

  useEffect(() => {
    if (isReady) getVenue();
  }, [isReady]);

  const [updateVenue] = useUpdateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    setLoadingUpdate(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { chapter_id, ...updateData } = data;
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      await updateVenue({
        variables: {
          venueId,
          chapterId,
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

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;

  return (
    <VenueForm
      data={data}
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
