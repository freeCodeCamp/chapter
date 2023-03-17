import React from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '../../../../components/Form/Input';

interface DatePickerProps {
  date: Date;
  error: string;
  field: string;
  isRequired: boolean;
  label: string;
  loading: boolean;
  onChange: (date: Date | null) => void;
}

// TODO: figure out why only name and field from ReactDatePicker matter.  The
// ones in the custom input are ignored.
const DatePicker = ({
  date,
  error,
  field,
  isRequired,
  label,
  loading,
  onChange,
}: DatePickerProps) => {
  return (
    <ReactDatePicker
      name={field}
      id={field}
      selected={date}
      showTimeSelect
      timeIntervals={5}
      onChange={onChange}
      disabled={loading}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={
        <Input
          id={`${field}_trigger`}
          name={field}
          error={error}
          label={label}
          isDisabled={loading}
          isRequired={isRequired}
          value={date.toDateString()}
        />
      }
    />
  );
};

export default DatePicker;
