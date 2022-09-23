import React, { ReactNode } from 'react';
import { VStack } from '@chakra-ui/layout';
import styles from '../../styles/Form.module.css';

interface FormProps {
  (
    children: ReactNode,
    submitText: string,
    FormHandling: () => unknown,
  ): ReactNode;
}

export const From: FormProps = (children, submitText, FormHandling) => {
  return (
    <form
      aria-label={submitText}
      onSubmit={FormHandling}
      className={styles.form}
    >
      <VStack gap={4}>{children}</VStack>
    </form>
  );
};
