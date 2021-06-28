import React, { forwardRef } from 'react';
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
} from '@chakra-ui/react';

const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();

const allowed_types = [
  'text',
  'password',
  'current_password',
  'confirm_password',
  'email',
  'number',
] as const;

function isSpecifiedType(name: string): name is AllowedTypes {
  return (allowed_types as any).includes(name);
}

const resoleType = (name: string) => {
  if (isSpecifiedType(name)) {
    if (name === 'confirm_password' || name === 'current_password') {
      return 'password';
    }

    return name;
  }

  return 'text';
};

type AllowedTypes = typeof allowed_types[number];

export interface InputProps extends Omit<ChakraInputProps, 'type'> {
  label?: string;
  noLabel?: boolean;
  error?: string;
  name?: string;
  type?: AllowedTypes | string;
  outerProps?: FormControlProps;

  isTextArea?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    name: baseName = 'Input Field',
    isInvalid,
    isRequired,
    label,
    placeholder,
    outerProps,
    noLabel,
    ...rest
  } = props;

  const name = baseName.split('_').join(' ');

  return (
    <FormControl
      isInvalid={isInvalid || !!props.error}
      isRequired={isRequired}
      {...outerProps}
    >
      {!noLabel && (
        <FormLabel htmlFor={baseName}>{label || capitalize(name)}</FormLabel>
      )}
      <ChakraInput
        type={resoleType(baseName)}
        id={baseName}
        name={baseName}
        ref={ref}
        placeholder={placeholder || label || capitalize(name)}
        {...rest}
      />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  );
});
