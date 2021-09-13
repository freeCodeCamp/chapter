import { Box } from '@chakra-ui/layout';
import React from 'react';

import { Header } from './Header';

const PageLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box px={[4, 4, 8, 16]}>{children}</Box>
    </>
  );
};
export default PageLayout;
