import { Box } from '@chakra-ui/layout';
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import React from 'react';
import { SkipNavContent } from '@chakra-ui/skip-nav';

import { Header } from './Header';
import { Footer } from './component/Footer';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <SkipNavContent />
      <Box px={[4, 4, 8, 16]} id="main-content">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle> This is a testing site. </AlertTitle>
          <AlertDescription>
            This is a testing site for freeCodeCamp staff members and Chapter
            maintainers. Be mindful that your data will be deleted periodically.
          </AlertDescription>
        </Alert>
        {children}
      </Box>
      <Footer />
    </>
  );
};
export default PageLayout;
