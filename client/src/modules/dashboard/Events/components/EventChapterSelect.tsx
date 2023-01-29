import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useUser } from '../../../auth/user';
import { Select } from '../../../../components/Form/Select';

interface Chapter {
  id: number;
  name: string;
}
interface EventChapterSelectProps {
  loading: boolean;
}

const EventChapterSelect: React.FC<EventChapterSelectProps> = ({ loading }) => {
  const key = 'chapter_id';
  const { user } = useUser();
  const adminedChapters: Chapter[] = user?.admined_chapters ?? [];

  const {
    register,
    resetField,
    formState: { errors },
  } = useFormContext();
  const error = errors[key]?.message as string;

  useEffect(() => {
    resetField(key, { defaultValue: adminedChapters[0]?.id ?? -1 });
  }, [adminedChapters]);

  return (
    <Select
      label="Chapter"
      key={key}
      isRequired={true}
      isDisabled={loading}
      error={error}
      options={[...adminedChapters.map(({ id, name }) => ({ id, name }))]}
      {...register(key)}
    />
  );
};

export default EventChapterSelect;
