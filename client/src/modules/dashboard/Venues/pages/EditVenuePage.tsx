import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import NextError from 'next/error';

import { useConfirmDelete } from 'chakra-confirm';
import {
  useVenueQuery,
  useUpdateVenueMutation,
  useChapterQuery,
  useDeleteVenueMutation,
} from '../../../../generated/graphql';

import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { DASHBOARD_VENUES, VENUE } from '../graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';
import { DASHBOARD_CHAPTER } from '../../../dashboard/Chapters/graphql/queries';
import {
  DASHBOARD_EVENT,
  DASHBOARD_EVENTS,
} from '../../../dashboard/Events/graphql/queries';

export const EditVenuePage: NextPageWithLayout = () => {
  const router = useRouter();
  const confirmDelete = useConfirmDelete();
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
  const [deleteVenue] = useDeleteVenueMutation({
    refetchQueries: [
      { query: VENUE },
      { query: DASHBOARD_VENUES },
      { query: DASHBOARD_CHAPTER },
      { query: DASHBOARD_EVENT },
      { query: DASHBOARD_EVENTS },
    ],
  });

  const toast = useToast();

  const onSubmit = async (data: VenueFormData) => {
    const { chapter_id, ...updateData } = data;

    const latitude = parseFloat(String(data.latitude));
    const longitude = parseFloat(String(data.longitude));

    const { data: venueData, errors } = await updateVenue({
      variables: {
        venueId,
        chapterId: chapter_id,
        data: { ...updateData, latitude, longitude },
      },
    });
    if (errors) throw errors;
    if (venueData) {
      await router.push('/dashboard/venues');
      toast({
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

  const clickDelete = async () => {
    const ok = await confirmDelete({
      body: 'Are you sure you want to delete this venue? All information related to venue will be deleted. Venue deletion cannot be reversed.',
      buttonText: 'Delete Venue',
    });
    if (!ok) return;
    deleteVenue({ variables: { venueId } });
    router.push('/dashboard/venues');
  };

  return (
    <VenueForm
      data={venueData}
      chapterData={chapterData}
      onSubmit={onSubmit}
      submitText={'Save Venue Changes'}
      chapterId={chapterId}
      loadingText={'Saving Venue Changes'}
      deleteText={'Delete Venue'}
      deleteVenue={clickDelete}
    />
  );
};

EditVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout dataCy="edit-venue-page">{page}</Layout>;
};
