import { Button } from '@chakra-ui/button';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../../../../components/Form/Fields';
import { Sponsor, SponsorQuery } from 'generated/graphql';

export type SponsorFormData = Omit<
  Sponsor,
  'id' | 'created_at' | 'updated_at' | 'events'
>;

interface SpornsorFormProps {
  loading: boolean;
  onSubmit: (data: SponsorFormData) => Promise<void>;
  data?: SponsorQuery;
  submitText: string;
}
type Fields = [keyof Omit<SponsorFormData, '__typename'>, boolean];
const fields: Fields[] = [
  ['name', true],
  ['website', true],
  ['logo_path', true],
];
const SponsorForm: React.FC<SpornsorFormProps> = (props) => {
  const { loading, onSubmit, data, submitText } = props;
  const sponsor = data?.sponsor;
  const defaultValues: SponsorFormData = {
    name: sponsor?.name ?? '',
    website: sponsor?.website ?? '',
    logo_path: sponsor?.logo_path ?? '',
    type: sponsor?.type ?? 'FOOD',
  };

  const { control, handleSubmit } = useForm({
    defaultValues,
  });
  console.log(fields);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}
    >
      {fields.map(([name, required]) => {
        <Field
          key={name}
          {...{ control, name }}
          type="text"
          required={required}
        />;
      })}
      <Button
        mt="20px"
        variant="solid"
        colorScheme="blue"
        type="submit"
        disabled={loading}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default SponsorForm;
