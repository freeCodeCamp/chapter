import { Input, FormLabel } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { Control, Controller } from 'react-hook-form';

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
      render={({ field }) => (
        <Fragment>
          <FormLabel>
            {label} {required ? '*' : ''} :{' '}
          </FormLabel>
          <Input
            {...field}
            id={name}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder}
            required={required}
            variant="flushed"
          />
        </Fragment>
      )}
      name={name}
      rules={{ required }}
      defaultValue={defaultValue}
    />
  );
};

export const TextInput: React.FC<InputFieldProps<any>> = (props) => (
  <Field {...props} type="text" />
);
export const NumberInput: React.FC<InputFieldProps<any>> = (props) => (
  <Field {...props} type="number" />
);
