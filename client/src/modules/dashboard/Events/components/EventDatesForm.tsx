import { FormControl, FormHelperText, HStack } from '@chakra-ui/react';
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
  newEvent: boolean;
  startAt: Date;
}

const EventDatesForm: React.FC<EventDatesFormProps> = ({
  endsAt,
  loading,
  newEvent,
  startAt,
}) => {
  const { setValue, setError, clearErrors, formState } = useFormContext();
  const [startDate, setStartDate] = useState<Date>(startAt);
  const [endDate, setEndDate] = useState<Date>(endsAt);
  setValue('start_at', startDate);
  setValue('ends_at', endDate);
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

  const datePicker = ({
    key,
    date,
    error,
    label,
    isRequired,
  }: {
    key: string;
    date: Date;
    error: string;
    label: string;
    isRequired: boolean;
  }) => (
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

  const startDateProps = {
    key: 'start_at',
    label: 'Start at',
    isRequired: true,
    date: startDate,
    error: startError,
  };
  const endDateProps = {
    key: 'ends_at',
    label: 'End at',
    isRequired: true,
    date: endDate,
    error: endError,
  };

  return (
    <>
      <FormControl isRequired={startDateProps.isRequired}>
        <>
          {datePicker(startDateProps)}
          {isPast(startDate) && (
            <HStack>
              <InfoIcon fontSize="sm" />
              <FormHelperText data-cy="past-date-info">
                {newEvent
                  ? 'Chapter members will not be notified about creation of this event, as it starts in the past.'
                  : formState.dirtyFields.start_at
                  ? 'Changed date is in the past.'
                  : 'Start date has already passed.'}
              </FormHelperText>
            </HStack>
          )}
        </>
      </FormControl>
      <FormControl isRequired={endDateProps.isRequired}>
        {datePicker(endDateProps)}
      </FormControl>
    </>
  );
};

export default EventDatesForm;
