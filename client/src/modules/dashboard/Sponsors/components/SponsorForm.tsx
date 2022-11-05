import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { VStack } from '@chakra-ui/layout';

import { Input } from '../../../../components/Form/Input';
import styles from '../../../../styles/Form.module.css';
import { DashboardSponsorQuery, Sponsor } from '../../../../generated/graphql';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';

export type SponsorFormData = Omit<
  Sponsor,
  'id' | 'created_at' | 'updated_at' | 'events'
>;

interface SponsorFormProps {
  onSubmit: (data: SponsorFormData) => Promise<void>;
  data?: DashboardSponsorQuery;
  submitText: string;
  loadingText: string;
}
export interface FormField {
  key: keyof Omit<SponsorFormData, '__typename'>;
  placeholder: string;
  label: string;
  isRequired: boolean;
}
const fields: FormField[] = [
  {
    key: 'name',
    placeholder: 'freecodecamp',
    label: 'Sponsor Name',
    isRequired: true,
  },
  {
    key: 'website',
    placeholder: 'www.freecodecamp.com',
    label: 'Website Url',
    isRequired: false,
  },
  {
    key: 'logo_path',
    placeholder: 'www.freecodecamp.com',
    label: 'Logo Path',
    isRequired: false,
  },
];
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
    formState: { isDirty },
  } = useForm({
    defaultValues,
  });

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<SponsorFormData>({
      onSubmit,
    });

  return (
    <form
      onSubmit={handleSubmit(disableWhileSubmitting)}
      className={styles.form}
    >
      <VStack gap={4}>
        {fields.map((field) => {
          return (
            <Input
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              isRequired={field.isRequired}
              isDisabled={loading}
              {...register(field.key)}
            />
          );
        })}

        <FormControl mt="20px">
          <FormLabel>Sponsor Type</FormLabel>
          <Select {...register('type')} isDisabled={loading}>
            <option value="FOOD">Food</option>
            <option value="VENUE">Venue</option>
            <option value="OTHER">Other</option>
          </Select>
        </FormControl>
        <Button
          mt="20px"
          variant="solid"
          colorScheme="blue"
          type="submit"
          isLoading={loading}
          loadingText={loadingText}
          isDisabled={!isDirty || loading}
        >
          {submitText}
        </Button>
      </VStack>
    </form>
  );
};

export default SponsorForm;
