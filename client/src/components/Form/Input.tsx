import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

const allowed_types = ['text', 'email', 'number'] as const;

function isSpecifiedType(name?: string) {
  return name ? (allowed_types as unknown as string[]).includes(name) : false;
}

const resolveType = (name?: string) => {
  return isSpecifiedType(name) ? name : 'text';
};

type AllowedTypes = (typeof allowed_types)[number];

interface BaseProps extends Omit<ChakraInputProps, 'type'> {
  error?: string;
  type?: AllowedTypes | string;
  outerProps?: FormControlProps;
  isTextArea?: boolean;
}

type NoLabelProps = BaseProps & {
  noLabel: true;
  label?: never;
};

type HasLabelProps = BaseProps & {
  noLabel?: false;
  label: string;
  name: string;
};

export const Input = forwardRef<HTMLInputElement, NoLabelProps | HasLabelProps>(
  (props, ref) => {
    const {
      name,
      isInvalid,
      isRequired,
      label,
      placeholder,
      outerProps,
      noLabel,
      ...rest
    } = props;
    const isError = isInvalid || !!props.error;
    return (
      <FormControl
        isInvalid={isError}
        isRequired={isRequired} //TODO: determine which inputs are required
        {...outerProps}
      >
        {!noLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraInput
          type={resolveType(name)}
          id={name}
          name={name}
          ref={ref}
          placeholder={placeholder ?? label}
          isInvalid={isError}
          {...rest}
        />
        <FormErrorMessage>{props.error}</FormErrorMessage>
      </FormControl>
    );
  },
);
