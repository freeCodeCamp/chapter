import { FormControl, FormHelperText, HStack } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { isPast } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from './DatePicker';

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
    (key: string, setDate: (date: React.SetStateAction<Date>) => void) => {
      return (date: Date | null) => {
        if (!date) return;
        setValue(key, date, { shouldDirty: true });
        setDate(date);
      };
    },
    [setValue, setStartDate, setEndDate],
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
    date: startDate,
    error: startError,
    isRequired: true,
    key: 'start_at',
    label: 'Start at',
    loading,
    onChange: onDatePickerChange('start_at', setStartDate),
  };
  const endDateProps = {
    date: endDate,
    error: endError,
    key: 'ends_at',
    isRequired: true,
    label: 'End at',
    loading,
    onChange: onDatePickerChange('ends_at', setEndDate),
  };

  return (
    <>
      <FormControl isRequired={startDateProps.isRequired}>
        <>
          <DatePicker {...startDateProps} />
          {isPast(startDate) && (
            <HStack>
              <InfoIcon fontSize="sm" />
              <FormHelperText data-cy="past-date-info">
                {newEvent
                  ? 'Chapter members will not be notified about creation of this event, as it starts in the past.'
                  : formState.dirtyFields.start_at
                  ? 'New date is in the past.'
                  : 'Start date has already passed.'}
              </FormHelperText>
            </HStack>
          )}
        </>
      </FormControl>
      <FormControl isRequired={endDateProps.isRequired}>
        <DatePicker {...endDateProps} />
      </FormControl>
    </>
  );
};

export default EventDatesForm;
