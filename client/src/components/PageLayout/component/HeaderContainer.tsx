import React, { forwardRef } from 'react';
import { Flex, GridItemProps } from '@chakra-ui/react';

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
        height={'4.5em'}
        px={[2, 4, 8]}
        py={[2, 4]}
        background={'gray.85'}
        gap={'.5em'}
      />
    );
  },
);
