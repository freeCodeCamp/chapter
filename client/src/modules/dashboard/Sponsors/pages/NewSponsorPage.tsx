import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { useCreateSponsorMutation } from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';

const NewSponsorPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: Sponsors }],
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
      loadingText="Adding New Sponsor"
    />
  );
};

export { NewSponsorPage };

NewSponsorPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
