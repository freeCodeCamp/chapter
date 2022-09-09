import { Input, FormLabel, FormControl } from '@chakra-ui/react';
import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  name: string;
  placeholder?: string;
  label?: string;
  control: Control<T>;
  defaultValue?: string | number;
  required?: boolean;
}

interface BaseProps<T extends FieldValues> extends InputFieldProps<T> {
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
        <FormControl mt="20px" key={name} isRequired={required}>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <Input
            {...field}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            variant="flushed"
          />
        </FormControl>
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
