import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useParam } from '../../../../hooks/useParam';
import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { SPONSOR } from '../graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
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

  const isLoading = sponsorLoading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;

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
