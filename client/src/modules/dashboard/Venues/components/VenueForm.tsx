import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl } from '@material-ui/core';

import useFormStyles from '../../shared/components/formStyles';
import type { Venue, VenueQuery } from '../../../../generated/graphql';
import { Field } from '../../../../components/Form/Fields';

export type VenueFormData = Omit<
  Venue,
  'id' | 'created_at' | 'updated_at' | 'events'
>;

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
  const styles = useFormStyles();

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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map(([name, required, number]) => (
        <FormControl className={styles.item} key={name}>
          <Field
            {...{ control, name }}
            type={number ? 'number' : 'text'}
            required={required}
          />
        </FormControl>
      ))}
      <Button
        className={styles.item}
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default VenueForm;
