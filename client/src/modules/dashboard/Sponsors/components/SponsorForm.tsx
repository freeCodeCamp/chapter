import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import styles from '../../../../styles/Form.module.css';
import { Sponsor, SponsorQuery } from 'generated/graphql';

export type SponsorFormData = Omit<
  Sponsor,
  'id' | 'created_at' | 'updated_at' | 'events'
>;

interface SponsorFormProps {
  loading: boolean;
  onSubmit: (data: SponsorFormData) => Promise<void>;
  data?: SponsorQuery;
  submitText: string;
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
    isRequired: true,
  },
  {
    key: 'logo_path',
    placeholder: 'www.freecodecamp.com',
    label: 'Logo Path',
    isRequired: true,
  },
];
const SponsorForm: React.FC<SponsorFormProps> = (props) => {
  const { loading, onSubmit, data, submitText } = props;
  const sponsor = data?.sponsor;
  const defaultValues: SponsorFormData = {
    name: sponsor?.name ?? '',
    website: sponsor?.website ?? '',
    logo_path: sponsor?.logo_path ?? '',
    type: sponsor?.type ?? 'FOOD',
  };

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues,
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map((field) => {
        return (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            isRequired={field.isRequired}
            isDisabled={isSubmitting}
            {...register(field.key)}
          />
        );
      })}

      <FormControl mt="20px">
        <FormLabel>Sponsor Type</FormLabel>
        <Select {...register('type')} isDisabled={isSubmitting}>
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
        isLoading={isSubmitting}
        loadingText="Saving Changes"
        isDisabled={!isDirty || isSubmitting || loading}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default SponsorForm;
