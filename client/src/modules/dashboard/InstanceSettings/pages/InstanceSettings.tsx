import React from 'react';
import { Button, FormControl, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Form } from '../../../../components/Form/Form';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import {
  InstanceSettingsInputs,
  useInstanceSettingsQuery,
  useUpdateInstanceSettingsMutation,
} from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';

export const InstanceSettingsPage = () => {
  const { data, loading, error } = useInstanceSettingsQuery();
  const { handleSubmit, formState } = useForm();
  const { isDirty } = formState;
  const [updateInstanceSettings] = useUpdateInstanceSettingsMutation();
  const onSubmit = async (data: InstanceSettingsInputs) => {
    const { errors } = await updateInstanceSettings({
      variables: { data: data },
    });
    if (errors) throw errors;
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  const { disableWhileSubmitting } = useDisableWhileSubmitting({
    onSubmit,
  });
  return (
    <>
      <h1>InstanceSettings</h1>
      <Form
        submitLabel="Edit the instance settings"
        FormHandling={handleSubmit(disableWhileSubmitting)}
      >
        <FormControl>Policy</FormControl>
        <Input
          type="text"
          {...(data.instanceSettings.policy_url && {
            value: data.instanceSettings.policy_url,
          })}
        />
        <FormControl>Terms of service</FormControl>
        <Input
          type="text"
          {...(data.instanceSettings.terms_of_services_url && {
            value: data.instanceSettings.terms_of_services_url,
          })}
        />
        <FormControl>Code of conduct</FormControl>
        <Input
          type="text"
          {...(data.instanceSettings.code_of_conduct_url && {
            value: data.instanceSettings.code_of_conduct_url,
          })}
        />

        <Button type="submit" isDisabled={!isDirty}>
          Edit instance settings
        </Button>
      </Form>
    </>
  );
};

InstanceSettingsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
