import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAuth } from '../../../auth/store';

interface Chapter {
  id: number;
  name: string;
}
interface EventChapterSelectProps {
  loading: boolean;
}

const EventChapterSelect: React.FC<EventChapterSelectProps> = ({ loading }) => {
  const { user } = useAuth();
  const adminedChapters: Chapter[] = user?.admined_chapters ?? [];

  const { register, resetField } = useFormContext();

  useEffect(() => {
    resetField('chapter_id', { defaultValue: adminedChapters[0]?.id ?? -1 });
  }, [adminedChapters]);

  return (
    <FormControl isRequired>
      <FormLabel>Chapter (Required)</FormLabel>
      <Select
        {...register('chapter_id' as const, {
          required: true,
          valueAsNumber: true,
        })}
        isDisabled={loading}
      >
        {adminedChapters.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default EventChapterSelect;
