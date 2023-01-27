import React, { ReactNode } from 'react';
import { VStack } from '@chakra-ui/layout';
import styles from '../../styles/Form.module.css';

interface FormProps {
  children: ReactNode;
  submitLabel: string;
  FormHandling: () => unknown;
}

export const Form = ({ children, submitLabel, FormHandling }: FormProps) => {
  return (
    <form
      aria-label={submitLabel}
      onSubmit={FormHandling}
      className={styles.form}
      noValidate
    >
      <VStack gap={4} alignItems={'flex-start'}>
        {children}
      </VStack>
    </form>
  );
};
