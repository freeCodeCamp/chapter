import { FormControl } from '@chakra-ui/form-control';
import React, { useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFormContext } from 'react-hook-form';

import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '../../../../components/Form/Input';

interface EventDatesFormProps {
  endsAt: Date;
  loading: boolean;
  startAt: Date;
}

const EventDatesForm: React.FC<EventDatesFormProps> = ({
  endsAt,
  loading,
  startAt,
}) => {
  const { getValues, setValue } = useFormContext();
  const [startDate, setStartDate] = useState<Date>(startAt);
  const [endDate, setEndDate] = useState<Date>(endsAt);

  const onDatePickerChange = useCallback(
    (key: string) => {
      return (date: Date | null) => {
        if (!date) return;
        if (key === 'start_at' || date < getValues('start_at')) {
          setValue('start_at', date, { shouldDirty: true });
          setStartDate(date);
        }
        if (key === 'ends_at' || date > getValues('ends_at')) {
          setValue('ends_at', date, { shouldDirty: true });
          setEndDate(date);
        }
      };
    },
    [setValue, setStartDate],
  );

  const fields = [
    {
      key: 'start_at',
      label: 'Start at',
      isRequired: true,
      date: startDate,
    },
    {
      key: 'ends_at',
      label: 'End at',
      isRequired: true,
      date: endDate,
    },
  ];

  return (
    <>
      {fields.map(({ key, date, label, isRequired }) => (
        <FormControl key={key} isRequired={isRequired}>
          <DatePicker
            selected={date}
            showTimeSelect
            timeIntervals={5}
            onChange={onDatePickerChange(key)}
            disabled={loading}
            dateFormat="MMMM d, yyyy h:mm aa"
            customInput={
              <Input
                id={`${key}_trigger`}
                name={`${key}`}
                label={`${label}${isRequired ? ' (Required)' : ''}`}
                isDisabled={loading}
                isRequired={isRequired}
                value={date.toDateString()}
              />
            }
          />
        </FormControl>
      ))}
    </>
  );
};

export default EventDatesForm;
