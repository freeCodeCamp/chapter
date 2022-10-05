import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { useCreateSponsorMutation } from '../../../../generated/graphql';
import { useCheckPermission } from '../../../../hooks/useCheckPermission';
import { NextPageWithLayout } from '../../../../pages/_app';
import { Permission } from '../../../../../../common/permissions';

const NewSponsorPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: Sponsors }],
  });

  const [loadingPermission, hasPermissionToCreateSponsor] = useCheckPermission(
    Permission.SponsorManage,
  );
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

  if (loadingPermission)
    return <DashboardLoading loading={loadingPermission} />;
  if (!hasPermissionToCreateSponsor)
    return <NextError statusCode={403} title="Access denied" />;

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
