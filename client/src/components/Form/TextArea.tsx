import React, { forwardRef } from 'react';
import {
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
  Textarea as ChakraTextarea,
} from '@chakra-ui/react';

const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();

const allowed_types = ['text'] as const;

type AllowedTypes = typeof allowed_types[number];

export interface TextAreaProps extends Omit<ChakraTextareaProps, 'type'> {
  label?: string;
  noLabel?: boolean;
  error?: string;
  name?: string;
  type?: AllowedTypes | string;
  outerProps?: FormControlProps;
}

export const TextArea = forwardRef<any, TextAreaProps>((props, ref) => {
  const {
    name: baseName = 'TextArea Field',
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
      <ChakraTextarea
        id={baseName}
        name={baseName}
        ref={ref as any}
        placeholder={placeholder || label || capitalize(name)}
        {...rest}
      />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  );
});
