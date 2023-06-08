import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import NextError from 'next/error';

import {
  useVenueQuery,
  useUpdateVenueMutation,
  useChapterQuery,
} from '../../../../generated/graphql';

import { DashboardLoading } from '../../shared/components/DashboardLoading';
import VenueForm from '../components/VenueForm';
import { parseVenueData, VenueFormData } from '../components/VenueFormUtils';
import { DASHBOARD_VENUE, DASHBOARD_VENUES } from '../graphql/queries';
import { useAlert } from '../../../../hooks/useAlert';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';
import { DashboardLayout } from '../../../dashboard/shared/components/DashboardLayout';

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
    refetchQueries: [
      { query: DASHBOARD_VENUE, variables: { venueId } },
      { query: DASHBOARD_VENUES },
    ],
  });

  const addAlert = useAlert();

  const onSubmit = async (data: VenueFormData) => {
    const { data: venueData, errors } = await updateVenue({
      variables: {
        venueId,
        chapterId: data.chapter_id,
        data: parseVenueData(data),
      },
    });
    if (errors) throw errors;
    if (venueData) {
      await router.push('/dashboard/venues');
      addAlert({
        title: `Venue "${venueData?.updateVenue.name}" updated successfully!`,
        status: 'success',
      });
    }
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
  return <DashboardLayout dataCy="edit-venue-page">{page}</DashboardLayout>;
};
