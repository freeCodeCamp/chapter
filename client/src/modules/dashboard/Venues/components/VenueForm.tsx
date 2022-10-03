import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import { useChapterQuery } from '../../../../generated/graphql';
import type { Venue, VenueQuery } from '../../../../generated/graphql';
import { Form } from '../../../../components/Form/Form';
import { useAuth } from 'modules/auth/store';

export type VenueFormData = Omit<Venue, 'id' | 'events' | 'chapter'>;

interface VenueFormProps {
  loading: boolean;
  onSubmit: (data: VenueFormData) => Promise<void>;
  data?: VenueQuery;
  submitText: string;
  chapterId: number;
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

const VenueForm: React.FC<VenueFormProps> = (props) => {
  const { loading, onSubmit, data, submitText, chapterId, loadingText } = props;
  const venue = data?.venue;
  const isChaptersDropdownNeeded = chapterId === -1;

  const {
    loading: loadingChapter,
    data: dataChapter,
    error: errorChapter,
  } = useChapterQuery({
    variables: { chapterId },
  });

  const defaultValues: VenueFormData = {
    name: venue?.name ?? '',
    street_address: venue?.street_address ?? undefined,
    city: venue?.city ?? '',
    postal_code: venue?.postal_code ?? '',
    region: venue?.region ?? '',
    country: venue?.country ?? '',
    latitude: venue?.latitude ?? undefined,
    longitude: venue?.longitude ?? undefined,
    chapter_id: chapterId,
  };
  const {
    formState: { isDirty },
    handleSubmit,
    register,
    resetField,
  } = useForm<VenueFormData>({
    defaultValues,
  });

  interface Chapter {
    id: number;
    name: string;
  }
  let adminedChapters: Chapter[] = [];
  if (isChaptersDropdownNeeded) {
    const { user } = useAuth();
    adminedChapters = user?.admined_chapters ?? [];
  }

  useEffect(() => {
    resetField('chapter_id', { defaultValue: adminedChapters[0]?.id ?? -1 });
  }, [adminedChapters]);

  return (
    <Form submitLabel={submitText} FormHandling={handleSubmit(onSubmit)}>
      {!isChaptersDropdownNeeded ? (
        loadingChapter ? (
          <Text>Loading Chapter</Text>
        ) : errorChapter || !dataChapter?.chapter ? (
          <Text>Error loading chapter</Text>
        ) : (
          <Heading>{dataChapter.chapter.name}</Heading>
        )
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
            {adminedChapters?.length &&
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
    </Form>
  );
};

export default VenueForm;
