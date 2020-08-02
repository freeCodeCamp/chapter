import { Control, Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';

interface InputFieldProps<T> {
  name: string;
  placeholder?: string;
  label?: string;
  control: Control<T>;
  defaultValue?: string | number;
  required?: boolean;
}

interface BaseProps<T> extends InputFieldProps<T> {
  type: string;
}

export const Field: React.FC<BaseProps<any>> = ({
  name,
  defaultValue,
  control,
  type,
  required,
  ...rest
}) => {
  const { placeholder = name, label = name } = rest;

  return (
    <Controller
      control={control}
      as={
        <TextField
          name={name}
          type={type}
          label={label}
          placeholder={placeholder}
          required={required}
        />
      }
      name={name}
      options={{ required }}
      defaultValue={defaultValue}
    />
  );
};

export const TextInput: React.FC<InputFieldProps<any>> = props => (
  <Field {...props} type="text" />
);
export const NumberInput: React.FC<InputFieldProps<any>> = props => (
  <Field {...props} type="number" />
);
