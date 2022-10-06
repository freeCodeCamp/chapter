import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { useCreateSponsorMutation } from '../../../../generated/graphql';
import { checkPermission } from '../../../../hooks/useCheckPermission';
import { NextPageWithLayout } from '../../../../pages/_app';
import { Permission } from '../../../../../../common/permissions';
import { useAuth } from 'modules/auth/store';

const NewSponsorPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: Sponsors }],
  });
  const { user, loadingUser } = useAuth();

  const hasPermissionToCreateSponsor = checkPermission(
    user,
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

  if (loadingUser) return <DashboardLoading loading={loadingUser} />;
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
