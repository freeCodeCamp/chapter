import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import { useAlert } from '../../../../hooks/useAlert';
import { useParam } from '../../../../hooks/useParam';
import { Sponsors } from '../../Events/graphql/queries';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import SponsorForm from '../components/SponsorForm';
import { DASHBOARD_SPONSOR } from '../graphql/queries';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import {
  useDashboardSponsorQuery,
  useUpdateSponsorMutation,
} from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';
import { SponsorFormData } from '../components/SponsorFormUtils';

const EditSponsorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { param: sponsorId } = useParam('id');
  const {
    loading: sponsorLoading,
    error,
    data,
  } = useDashboardSponsorQuery({
    variables: { sponsorId },
  });
  const [updateSponsor] = useUpdateSponsorMutation({
    refetchQueries: [
      { query: DASHBOARD_SPONSOR, variables: { id: sponsorId } },
      { query: Sponsors },
    ],
  });

  const addAlert = useAlert();

  const onSubmit = async (data: SponsorFormData) => {
    const { data: sponsorData, errors } = await updateSponsor({
      variables: {
        data,
        updateSponsorId: sponsorId,
      },
    });
    if (errors) throw errors;
    if (sponsorData) {
      await router.replace('/dashboard/sponsors');
      addAlert({
        title: `Sponsor "${sponsorData?.updateSponsor.name}" updated successfully!`,
        status: 'success',
      });
    }
  };

  const isLoading = sponsorLoading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardSponsor)
    return <NextError statusCode={404} title="Sponsor not found" />;

  return (
    <SponsorForm
      onSubmit={onSubmit}
      data={data}
      submitText="Save Sponsor Changes"
      loadingText="Saving Sponsor Changes"
    />
  );
};

export { EditSponsorPage };

EditSponsorPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
