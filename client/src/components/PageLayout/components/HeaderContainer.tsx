import { Flex } from '@chakra-ui/layout';
import React, { forwardRef } from 'react';
import type { GridItemProps } from '@chakra-ui/react';
import styles from '../../../styles/Header.module.css';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}

export const HeaderContainer = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        ref={ref}
        {...props}
        w="full"
        as="header"
        px={[2, 4, 8]}
        py={[2, 4]}
        background={'gray.85'}
        className={styles.header}
      />
    );
  },
);
