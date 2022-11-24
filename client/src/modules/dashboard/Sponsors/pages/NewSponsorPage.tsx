import { useToast } from '@chakra-ui/react';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import { Sponsors } from '../../Events/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import SponsorForm, { SponsorFormData } from '../components/SponsorForm';
import { useCreateSponsorMutation } from '../../../../generated/graphql';
import { checkPermission } from '../../../../util/check-permission';
import { NextPageWithLayout } from '../../../../pages/_app';
import { Permission } from '../../../../../../common/permissions';
import { useAuth } from 'modules/auth/store';

const NewSponsorPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [createSponsor] = useCreateSponsorMutation({
    refetchQueries: [{ query: Sponsors }],
  });
  const { user, loadingUser } = useAuth();

  const hasPermissionToCreateSponsor = checkPermission(
    user,
    Permission.SponsorManage,
  );

  const toast = useToast();
  const onSubmit = async (data: SponsorFormData) => {
    const { data: sponsorData, errors } = await createSponsor({
      variables: {
        data,
      },
    });

    if (errors) throw errors;
    if (sponsorData) {
      await router.replace('/dashboard/sponsors');
      toast({
        title: `Sponsor "${sponsorData.createSponsor.name}" created!`,
        status: 'success',
      });
    }
  };

  if (loadingUser) return <DashboardLoading />;
  if (!hasPermissionToCreateSponsor)
    return <NextError statusCode={403} title="Access denied" />;

  return (
    <SponsorForm
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
