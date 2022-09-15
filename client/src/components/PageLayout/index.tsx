import { Box } from '@chakra-ui/layout';
import React from 'react';

import { Header } from './Header';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Box px={[4, 4, 8, 16]} id="main-content">
        {children}
      </Box>
    </>
  );
};
export default PageLayout;
