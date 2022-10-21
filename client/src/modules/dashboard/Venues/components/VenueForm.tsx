import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import type {
  VenueQuery,
  VenueInputs,
  ChapterQuery,
} from '../../../../generated/graphql';
import { Form } from '../../../../components/Form/Form';

export type VenueFormData = Required<VenueInputs> & { chapter_id: number };

interface VenueFormProps {
  onSubmit: (data: VenueFormData) => Promise<void>;
  data?: VenueQuery;
  chapterData?: ChapterQuery;
  adminedChapters?: { name: string; id: number }[];
  submitText: string;
  chapterId?: number;
  loadingText: string;
}

type Fields = {
  key: keyof VenueInputs;
  label: string;
  placeholder: string;
  isRequired: boolean;
  type: 'text' | 'number';
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
    isRequired: false,
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

// We could loop over the fields array to generate this, but we'd lose type
// safety by doing so.
const getDefaultValues = (chapterId: number, venue?: VenueQuery['venue']) => ({
  chapter_id: chapterId,
  name: venue?.name ?? '',
  street_address: venue?.street_address ?? null,
  city: venue?.city ?? '',
  postal_code: venue?.postal_code ?? '',
  region: venue?.region ?? '',
  country: venue?.country ?? '',
  latitude: venue?.latitude ?? null,
  longitude: venue?.longitude ?? null,
});

const VenueForm: React.FC<VenueFormProps> = (props) => {
  const {
    onSubmit,
    data,
    submitText,
    chapterId,
    loadingText,
    chapterData,
    adminedChapters = [],
  } = props;

  const [loading, setLoading] = useState(false);
  const venue = data?.venue;

  const defaultChapterId = adminedChapters[0]?.id ?? chapterId;
  const defaultValues: VenueFormData = getDefaultValues(
    defaultChapterId,
    venue,
  );
  const {
    formState: { isDirty },
    handleSubmit,
    register,
  } = useForm<VenueFormData>({
    defaultValues,
  });

  const disableWhileSubmitting = async (data: VenueFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
      {chapterData ? (
        <Heading>{chapterData.chapter.name}</Heading>
      ) : (
        <FormControl isRequired>
          <FormLabel>Chapter</FormLabel>
          <Select
            {...register('chapter_id' as const, {
              required: true,
              valueAsNumber: true,
            })}
            isDisabled={loading}
          >
            {adminedChapters.length &&
              adminedChapters.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {fields.map(({ key, isRequired, label, type, step, max, min }) => (
        <Input
          key={key}
          label={label}
          {...register(key)}
          type={type}
          isRequired={isRequired}
          step={step}
          max={max}
          min={min}
          isDisabled={loading}
        />
      ))}
      <Button
        mt="30px"
        width="100%"
        variant="solid"
        colorScheme="blue"
        type="submit"
        isDisabled={!isDirty}
        isLoading={loading}
        loadingText={loadingText}
      >
        {submitText}
      </Button>
    </Form>
  );
};

export default VenueForm;
