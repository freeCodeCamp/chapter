import { Box } from '@chakra-ui/layout';
import React from 'react';

import { Header } from './Header';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Box>{children}</Box>
    </>
  );
};
export default PageLayout;
