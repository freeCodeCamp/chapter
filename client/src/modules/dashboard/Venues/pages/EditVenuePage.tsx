import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import NextError from 'next/error';

import {
  useVenueQuery,
  useUpdateVenueMutation,
  useChapterQuery,
} from '../../../../generated/graphql';

import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { DASHBOARD_VENUES } from '../graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const EditVenuePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: venueId } = useParam('venueId');
  const { param: chapterId } = useParam('id');

  const { data: chapterData, error: chapterError } = useChapterQuery({
    variables: { chapterId },
  });

  const { data: venueData, error: venueError } = useVenueQuery({
    variables: { venueId },
  });

  const [updateVenue] = useUpdateVenueMutation({
    refetchQueries: [{ query: DASHBOARD_VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    const { chapter_id, ...updateData } = data;

    const latitude = parseFloat(String(data.latitude));
    const longitude = parseFloat(String(data.longitude));

    const { errors } = await updateVenue({
      variables: {
        venueId,
        chapterId: chapter_id,
        data: { ...updateData, latitude, longitude },
      },
    });
    if (errors) throw errors;
    await router.push('/dashboard/venues');
  };

  const hasLoaded = !!venueData && !!chapterData;
  const errors: Error[] = [];
  if (venueError) errors.push(venueError);
  if (chapterError) errors.push(chapterError);

  if (!hasLoaded || errors.length) return <DashboardLoading errors={errors} />;
  if (!venueData.venue || !chapterData.chapter)
    return <NextError statusCode={404} title={'Page not found'} />;

  return (
    <VenueForm
      data={venueData}
      chapterData={chapterData}
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
