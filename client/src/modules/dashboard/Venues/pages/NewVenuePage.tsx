import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

import { useCreateVenueMutation } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { VENUES } from '../graphql/queries';
import { useParam } from '../../../../hooks/useParam';
import { NextPageWithLayout } from '../../../../pages/_app';

export const NewVenuePage: NextPageWithLayout = () => {
  const { param: chapterId, isReady } = useParam('id');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

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

  const isLoading = loading || !isReady;
  if (isLoading) return <DashboardLoading loading={isLoading} />;

  return (
    <VenueForm
      loading={loading}
      onSubmit={onSubmit}
      submitText={'Add venue'}
      chapterId={chapterId}
      loadingText={'Adding venue'}
    />
  );
};

NewVenuePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
