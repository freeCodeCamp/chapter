import { FormControl, HStack, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFormContext } from 'react-hook-form';
import { isPast } from 'date-fns';

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
  const { setValue, setError, clearErrors } = useFormContext();
  const [startDate, setStartDate] = useState<Date>(startAt);
  const [endDate, setEndDate] = useState<Date>(endsAt);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const onDatePickerChange = useCallback(
    (key: string) => {
      return (date: Date | null) => {
        if (!date) return;
        if (key === 'start_at') {
          setValue('start_at', date, { shouldDirty: true });
          setStartDate(date);
        }
        if (key === 'ends_at') {
          setValue('ends_at', date, { shouldDirty: true });
          setEndDate(date);
        }
      };
    },
    [setValue, setStartDate],
  );

  useEffect(() => {
    if (startDate > endDate) {
      setError('start_at', { type: 'validate', message: 'date conflict' });
      setError('ends_at', { type: 'validate', message: 'date conflict' });
      setStartError('Start date cannot be after the end');
      setEndError('End date cannot be before the start');
    } else {
      setStartError('');
      setEndError('');
      clearErrors('start_at');
      clearErrors('ends_at');
    }
  }, [startDate, endDate]);

  const fields = [
    {
      key: 'start_at',
      label: 'Start at',
      isRequired: true,
      date: startDate,
      error: startError,
    },
    {
      key: 'ends_at',
      label: 'End at',
      isRequired: true,
      date: endDate,
      error: endError,
    },
  ];

  return (
    <>
      {fields.map(({ key, date, error, label, isRequired }) => (
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
                name={key}
                error={error}
                label={`${label}${isRequired ? ' (Required)' : ''}`}
                isDisabled={loading}
                isRequired={isRequired}
                value={date.toDateString()}
              />
            }
          />
          {key === 'start_at' && isPast(startDate) && (
            <HStack>
              <InfoIcon />
              <Text>
                Chapter members will not be notified about event creation, as it
                starts in the past.
              </Text>
            </HStack>
          )}
        </FormControl>
      ))}
    </>
  );
};

export default EventDatesForm;
