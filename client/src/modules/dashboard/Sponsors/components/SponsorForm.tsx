import React from 'react';
import { Button } from '@chakra-ui/button';
import { useForm } from 'react-hook-form';
import { VStack } from '@chakra-ui/layout';

import { Select } from '../../../../components/Form/Select';
import { Form } from '../../../../components/Form/Form';
import { Input } from '../../../../components/Form/Input';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import {
  fields,
  resolver,
  SponsorFormData,
  SponsorFormProps,
  sponsorTypes,
} from './SponsorFormUtils';

const SponsorForm: React.FC<SponsorFormProps> = (props) => {
  const { onSubmit, data, submitText, loadingText } = props;
  const sponsor = data?.dashboardSponsor;
  const defaultValues: SponsorFormData = {
    name: sponsor?.name ?? '',
    website: sponsor?.website ?? '',
    logo_path: sponsor?.logo_path ?? '',
    type: sponsor?.type ?? 'FOOD',
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    mode: 'all',
    resolver,
  });

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<SponsorFormData>({
      onSubmit,
    });

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
      <VStack gap={4}>
        {fields.map((field) => {
          const error = errors[field.key]?.message;
          return (
            <Input
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              isRequired={field.isRequired}
              isDisabled={loading}
              error={error}
              {...register(field.key)}
            />
          );
        })}

        <Select
          label="Sponsor Type"
          key="type"
          isRequired={true}
          isDisabled={loading}
          error={errors['type']?.message}
          options={[...sponsorTypes]}
          {...register('type')}
        />

        <Button
          mt="20px"
          variant="solid"
          colorScheme="blue"
          type="submit"
          isLoading={loading}
          loadingText={loadingText}
          isDisabled={!isDirty || loading || !isValid}
        >
          {submitText}
        </Button>
      </VStack>
    </Form>
  );
};

export default SponsorForm;
