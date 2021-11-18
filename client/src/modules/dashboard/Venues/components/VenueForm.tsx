import { Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../../../../components/Form/Fields';
import type { Venue, VenueQuery } from '../../../../generated/graphql';

export type VenueFormData = Omit<Venue, 'id' | 'events'>;

interface VenueFormProps {
  loading: boolean;
  onSubmit: (data: VenueFormData) => Promise<void>;
  data?: VenueQuery;
  submitText: string;
}

type Fields =
  | [keyof VenueFormData, boolean, boolean]
  | [keyof VenueFormData, boolean]
  | [keyof VenueFormData];

const fields: Fields[] = [
  ['name', true],
  ['street_address'],
  ['city', true],
  ['postal_code', true],
  ['region', true],
  ['country', true],
  ['latitude', false, true],
  ['longitude', false, true],
];

const VenueForm: React.FC<VenueFormProps> = (props) => {
  const { loading, onSubmit, data, submitText } = props;
  const venue = data?.venue;

  const defaultValues: VenueFormData = {
    name: venue?.name ?? '',
    street_address: venue?.street_address ?? undefined,
    city: venue?.city ?? '',
    postal_code: venue?.postal_code ?? '',
    region: venue?.region ?? '',
    country: venue?.country ?? '',
    latitude: venue?.latitude ?? undefined,
    longitude: venue?.longitude ?? undefined,
  };
  const { control, handleSubmit } = useForm<VenueFormData>({
    defaultValues,
  });

  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}
    >
      {fields.map(([name, required, number]) => (
        <Field
          key={name}
          {...{ control, name }}
          type={number ? 'number' : 'text'}
          required={required}
        />
      ))}
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

export default VenueForm;
