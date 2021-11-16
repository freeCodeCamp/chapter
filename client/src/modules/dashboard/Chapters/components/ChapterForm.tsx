import { Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../../../../components/Form/Fields';
import type { Chapter, ChapterQuery } from '../../../../generated/graphql';

export type ChapterFormData = Omit<
  Chapter,
  'id' | 'events' | 'creator' | 'users' | 'banned_users'
>;

interface ChapterFormProps {
  loading: boolean;
  onSubmit: (data: ChapterFormData) => Promise<void>;
  data?: ChapterQuery;
  submitText: string;
}

type Fields =
  | [keyof ChapterFormData, boolean, boolean]
  | [keyof ChapterFormData, boolean]
  | [keyof ChapterFormData];

const fields: Fields[] = [
  ['name', true],
  ['description', true],
  ['details', true],
  ['city', true],
  ['region', true],
  ['country', true],
  ['category', true],
  ['imageUrl', true],
];

const ChapterForm: React.FC<ChapterFormProps> = (props) => {
  const { loading, onSubmit, data, submitText } = props;
  const chapter = data?.chapter;

  const defaultValues: ChapterFormData = {
    name: chapter?.name ?? '',
    description: chapter?.description ?? '',
    details: chapter?.details ?? '',
    city: chapter?.city ?? '',
    region: chapter?.region ?? '',
    country: chapter?.country ?? '',
    category: chapter?.category ?? '',
    imageUrl: chapter?.imageUrl ?? '',
  };
  const { control, handleSubmit } = useForm<ChapterFormData>({
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

export default ChapterForm;
