import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface CheckboxProps extends ChakraCheckboxProps {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...rest }, ref) => {
    return (
      <ChakraCheckbox ref={ref} {...rest}>
        {label}
      </ChakraCheckbox>
    );
  },
);

export default Checkbox;
