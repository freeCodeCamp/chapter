import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useParam } from '../../../../hooks/useParam';
import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { SPONSOR } from '../graphql/queries';
import { useSponsorQuery, useUpdateSponsorMutation } from 'generated/graphql';
const EditSponsorPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { param: sponsorId, isReady } = useParam('id');
  const {
    loading: sponsorLoading,
    error,
    data,
  } = useSponsorQuery({
    variables: { sponsorId },
  });
  const [updateSponsor] = useUpdateSponsorMutation({
    refetchQueries: [
      { query: SPONSOR, variables: { id: sponsorId } },
      { query: Sponsors },
    ],
  });
  const onSubmit = async (data: SponsorFormData) => {
    setLoading(true);
    try {
      updateSponsor({
        variables: {
          data,
          updateSponsorId: sponsorId,
        },
      });
      router.replace('/dashboard/sponsors');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sponsorLoading || !isReady || error || !data?.sponsor) {
    return (
      <Layout>
        <h1>{sponsorLoading || !isReady ? 'Loading...' : 'Error...'}</h1>
        {error && <div>{error.message}</div>}
      </Layout>
    );
  }
  return (
    <Layout>
      <SponsorForm
        loading={loading}
        onSubmit={onSubmit}
        data={data}
        submitText="Save Sponsor Changes"
        loadingText="Saving Sponsor Changes"
      />
    </Layout>
  );
};

export { EditSponsorPage };
