import React, { useState } from 'react';
import { NextPage } from 'next';

import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { useRouter } from 'next/router';
import { useCreateVenueMutation } from '../../../../generated/graphql';
import { VENUES } from '../graphql/queries';

export const NewVenuePage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [createVenue] = useCreateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    setLoading(true);
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      await createVenue({
        variables: { data: { ...data, latitude, longitude } },
      });
      router.replace('/dashboard/venues');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <VenueForm
        loading={loading}
        onSubmit={onSubmit}
        submitText={'Add venue'}
      />
    </Layout>
  );
};
