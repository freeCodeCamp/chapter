import React, { forwardRef } from 'react';
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormControlProps,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';

interface Option {
  id: number | string;
  name: string;
}

interface SelectProps extends ChakraSelectProps {
  name: string;
  label: string;
  error?: string;
  noLabel?: false;
  options: Option[];
  outerProps?: FormControlProps;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      name,
      isInvalid,
      isRequired,
      label,
      outerProps,
      noLabel,
      options,
      ...rest
    } = props;
    const isError = isInvalid || !!props.error;
    return (
      <FormControl isInvalid={isError} isRequired={isRequired} {...outerProps}>
        {!noLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <ChakraSelect
          id={name}
          name={name}
          ref={ref}
          defaultValue={''}
          isInvalid={isError}
          {...rest}
        >
          {options.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </ChakraSelect>
        <FormErrorMessage>{props.error}</FormErrorMessage>
      </FormControl>
    );
  },
);
