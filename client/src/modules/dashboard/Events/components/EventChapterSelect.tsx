import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useUser } from '../../../auth/user';
import { Select } from '../../../../components/Form/Select';

interface Chapter {
  id: number;
  name: string;
}
interface EventChapterSelectProps {
  chapter?: Chapter;
  loading: boolean;
}

const EventChapterSelect: React.FC<EventChapterSelectProps> = ({
  chapter,
  loading,
}) => {
  const key = 'chapter_id';
  const { user } = useUser();
  const adminedChapters: Chapter[] = useMemo(
    () => (user?.admined_chapters ?? []).filter(({ id }) => id !== chapter?.id),
    [user?.admined_chapters, chapter?.id],
  );

  const {
    register,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors[key]?.message as string;

  useEffect(() => {
    if (chapter?.id) {
      setValue(key, adminedChapters[0]?.id ?? -1);
    } else {
      resetField(key, {
        defaultValue: adminedChapters[0]?.id ?? -1,
      });
    }
  }, [adminedChapters, chapter?.id]);

  return (
    <Select
      label="Chapter"
      key={key}
      isRequired={true}
      isDisabled={loading}
      error={error}
      options={[...adminedChapters.map(({ id, name }) => ({ id, name }))]}
      {...register(key, {
        valueAsNumber: true,
      })}
    />
  );
};

export default EventChapterSelect;
