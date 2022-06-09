import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: BoxProps['className'];
  children: React.ReactNode;
  mt?: BoxProps['mt'];
}

export const Card = ({ children, ...rest }: Props) => {
  return (
    <Box p="4" borderWidth="1px" borderRadius="lg" overflow="hidden" {...rest}>
      {children}
    </Box>
  );
};
