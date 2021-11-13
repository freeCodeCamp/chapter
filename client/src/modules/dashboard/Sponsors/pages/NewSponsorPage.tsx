import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Sponsors } from '../../Events/graphql/queries';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { useCreateSponsorMutation } from 'generated/graphql';
const NewSponsorPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: Sponsors }],
  });
  const onSubmit = async (data: SponsorFormData) => {
    setLoading(true);
    console.log('Logging the data');

    try {
      createSponsor({
        variables: {
          data,
        },
      });
      router.replace('/dashboard/sponsors');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SponsorForm
      loading={loading}
      onSubmit={onSubmit}
      submitText="Add New Sponsor"
    />
  );
};

export { NewSponsorPage };
