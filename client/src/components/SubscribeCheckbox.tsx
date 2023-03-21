import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface CheckboxProps extends ChakraCheckboxProps {
  label: string;
}

const SubscribeCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, defaultChecked, ...rest }, ref) => {
    const [subscribe, setSubscribe] = React.useState(defaultChecked);
    return (
      <ChakraCheckbox
        ref={ref}
        isChecked={subscribe}
        onChange={(e) => setSubscribe(e.target.checked)}
        {...rest}
      >
        {label}
      </ChakraCheckbox>
    );
  },
);

export const useSubscribeCheckbox = (defaultChecked: boolean) => {
  const ref = React.useRef<HTMLInputElement>(null);
  return {
    getSubscribe: () => ref?.current?.checked,
    SubscribeCheckbox: (props: CheckboxProps) => (
      <SubscribeCheckbox ref={ref} defaultChecked={defaultChecked} {...props} />
    ),
  };
};

export default SubscribeCheckbox;
