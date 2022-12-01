import { Box } from '@chakra-ui/layout';
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import React from 'react';
import { SkipNavContent } from '@chakra-ui/skip-nav';

import { LinkButton } from 'chakra-next-link';
import { Header } from './Header';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Alert status="error" marginBlock={'1em'}>
        <AlertIcon />
        <AlertDescription>
          This is a testing site for freeCodeCamp staff members and Chapter
          maintainers. Be mindful that your data will be deleted periodically.
          <LinkButton
            href="/policy"
            fontWeight="600"
            marginTop={'.25em'}
            background={'gray.85'}
            color={'gray.10'}
            height={'2.5em'}
            borderRadius={'5px'}
            _hover={{
              color: 'gray.85',
              backgroundColor: 'gray.10',
            }}
          >
            Know more about our policy
          </LinkButton>
        </AlertDescription>
      </Alert>
      <SkipNavContent />
      <Box px={[4, 4, 8, 16]} id="main-content">
        {children}
      </Box>
    </>
  );
};
export default PageLayout;
