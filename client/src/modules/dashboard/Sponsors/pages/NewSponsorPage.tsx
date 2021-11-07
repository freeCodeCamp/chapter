import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { SPONSOR } from '../graphql/queries';
import { useCreateSponsorMutation } from 'generated/graphql';
const NewSponsorPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: SPONSOR }],
  });
  const onSubmit = async (data: SponsorFormData) => {
    setLoading(true);
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
