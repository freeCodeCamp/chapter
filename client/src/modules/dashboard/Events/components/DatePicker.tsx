import React from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '../../../../components/Form/Input';

interface DatePickerProps {
  date: Date;
  error: string;
  isRequired: boolean;
  key: string;
  label: string;
  loading: boolean;
  onChange: (date: Date | null) => void;
}

const DatePicker = ({
  date,
  error,
  isRequired,
  key,
  label,
  loading,
  onChange,
}: DatePickerProps) => {
  return (
    <ReactDatePicker
      selected={date}
      showTimeSelect
      timeIntervals={5}
      onChange={onChange}
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
};

export default DatePicker;
