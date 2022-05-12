import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

import { capitalize } from '../../util/capitalize';

const allowed_types = ['text', 'email', 'number'] as const;

function isSpecifiedType(name?: string) {
  return name ? (allowed_types as unknown as string[]).includes(name) : false;
}

const resolveType = (name?: string) => {
  return isSpecifiedType(name) ? name : 'text';
};

type AllowedTypes = typeof allowed_types[number];

interface BaseProps extends Omit<ChakraInputProps, 'type'> {
  label?: string;
  error?: string;
  type?: AllowedTypes | string;
  outerProps?: FormControlProps;
  isTextArea?: boolean;
}

type NoLabelProps = BaseProps & {
  noLabel: true;
};

type HasLabelProps = BaseProps & {
  noLabel?: false;
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

    return (
      <FormControl
        isInvalid={isInvalid || !!props.error}
        isRequired={isRequired} //TODO: determine which inputs are required
        {...outerProps}
      >
        {!noLabel && (
          <FormLabel htmlFor={name}>{label || capitalize(name)}</FormLabel>
        )}
        <ChakraInput
          type={resolveType(name)}
          id={name}
          name={name}
          ref={ref}
          placeholder={placeholder || label || capitalize(name)}
          {...rest}
        />
        <FormErrorMessage>{props.error}</FormErrorMessage>
      </FormControl>
    );
  },
);
