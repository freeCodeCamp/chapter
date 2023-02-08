import { FormControl, FormHelperText, HStack } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import React, { useCallback, useState } from 'react';
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
  const {
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const [startDate, setStartDate] = useState<Date>(startAt);
  const [endDate, setEndDate] = useState<Date>(endsAt);

  const onDatePickerChange = useCallback(
    (field: string, setDate: (date: React.SetStateAction<Date>) => void) => {
      return (date: Date | null) => {
        if (!date) return;
        setValue(field, date, { shouldDirty: true, shouldValidate: true });
        setDate(date);
      };
    },
    [setValue, setStartDate, setEndDate],
  );

  const startDateProps = {
    date: startDate,
    error: errors['start_at']?.message as string,
    field: 'start_at',
    isRequired: true,
    label: 'Start at',
    loading,
    onChange: onDatePickerChange('start_at', setStartDate),
  };
  const endDateProps = {
    date: endDate,
    error: errors['ends_at']?.message as string,
    field: 'ends_at',
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
                  : dirtyFields.start_at
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
