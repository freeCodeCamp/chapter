import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl } from '@material-ui/core';

import useFormStyles from '../../shared/components/formStyles';
import type { Chapter, ChapterQuery } from '../../../../generated/graphql';
import { Field } from '../../../../components/Form/Fields';

export type ChapterFormData = Omit<
  Chapter,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'events'
  | 'creator'
  | 'users'
  | 'banned_users'
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
];

const ChapterForm: React.FC<ChapterFormProps> = (props) => {
  const { loading, onSubmit, data, submitText } = props;
  const chapter = data?.chapter;
  const styles = useFormStyles();

  const defaultValues: ChapterFormData = {
    name: chapter?.name ?? '',
    description: chapter?.description ?? '',
    details: chapter?.details ?? '',
    city: chapter?.city ?? '',
    region: chapter?.region ?? '',
    country: chapter?.country ?? '',
    category: chapter?.category ?? '',
  };
  const { control, handleSubmit } = useForm<ChapterFormData>({
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

export default ChapterForm;
