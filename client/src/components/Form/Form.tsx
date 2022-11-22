import React, { ReactNode } from 'react';
import { VStack } from '@chakra-ui/layout';
import styles from '../../styles/Form.module.css';

interface FormProps {
  children: ReactNode;
  submitLabel: string;
  onSubmit: () => void;
}

export const Form = ({ children, submitLabel, onSubmit }: FormProps) => {
  return (
    <form aria-label={submitLabel} onSubmit={onSubmit} className={styles.form}>
      <VStack gap={4} alignItems={'flex-start'}>
        {children}
      </VStack>
    </form>
  );
};
