import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '../../../../components/Form/Form';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import { UpdateInstanceSettingsInputs } from '../../../../generated/graphql';

export const InstanceSettings = () => {
  const { handleSubmit } = useForm();
  const [updateInstanceSettings] = useinstanceMutation();
  const onSubmit = async (data: UpdateInstanceSettingsInputs) => {
    const { errors } = await updateInstanceSettings({
      variables: { data: data },
    });
    if (errors) throw errors;
  };

  const { disableWhileSubmitting } = useDisableWhileSubmitting({
    onSubmit,
  });
  return (
    <>
      <h1>InstanceSettings</h1>
      <Form
        submitLabel="Edit the instance settings"
        FormHandling={handleSubmit(disableWhileSubmitting)}
      ></Form>
    </>
  );
};
