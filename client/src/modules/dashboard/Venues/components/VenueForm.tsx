import { Button, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import type { Venue, VenueQuery } from '../../../../generated/graphql';
import styles from '../../../../styles/Form.module.css';

export type VenueFormData = Omit<
  Venue,
  'id' | 'events' | 'chapter_id' | 'chapter'
>;

interface VenueChapter {
  id: number;
  name: string;
}

interface VenueFormProps {
  loading: boolean;
  onSubmit: (data: VenueFormData) => Promise<void>;
  data?: VenueQuery;
  submitText: string;
  chapter: VenueChapter;
  loadingText: string;
}

type Fields = {
  key: keyof VenueFormData;
  label: string;
  placeholder: string;
  isRequired: boolean;
  type: string;
  max?: number;
  min?: number;
  step?: number;
};
const fields: Fields[] = [
  {
    key: 'name',
    label: 'Venue name',
    placeholder: 'Venue name',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'street_address',
    label: 'Street address',
    placeholder: 'Street address',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'San Francisco',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    placeholder: '94501',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'Bay Area',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'United States of America',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'latitude',
    label: 'Latitude',
    placeholder: '',
    isRequired: false,
    type: 'number',
    max: 90,
    min: -90,
    step: 0.01,
  },
  {
    key: 'longitude',
    label: 'Longitude',
    placeholder: '',
    isRequired: false,
    type: 'number',
    max: 180,
    min: -180,
    step: 0.001,
  },
];

const VenueForm: React.FC<VenueFormProps> = (props) => {
  const { loading, onSubmit, data, submitText, chapter, loadingText } = props;
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
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<VenueFormData>({
    defaultValues,
  });

  return (
    <>
      {chapter && <Heading>{chapter.name}</Heading>}
      <form
        aria-label={submitText}
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
        <VStack>
          {fields.map(({ key, isRequired, label, type, step, max, min }) => (
            <Input
              key={key}
              label={label}
              {...register(key)}
              type={type}
              isRequired={isRequired}
              step={step ? step : undefined}
              max={max ? max : undefined}
              min={min ? min : undefined}
              isDisabled={loading}
            />
          ))}
          <Button
            mt="30px"
            width="100%"
            variant="solid"
            colorScheme="blue"
            type="submit"
            isDisabled={!isDirty || loading}
            isLoading={loading}
            loadingText={loadingText}
          >
            {submitText}
          </Button>
        </VStack>
      </form>
    </>
  );
};

export default VenueForm;
