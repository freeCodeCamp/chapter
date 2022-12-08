import { Box } from '@chakra-ui/layout';
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import React from 'react';
import { SkipNavContent } from '@chakra-ui/skip-nav';

import Link from 'next/link';
import { useCalendarIntegrationStatusQuery } from '../../generated/graphql';
import { useAuth } from '../../modules/auth/store';
import { checkPermission } from '../../util/check-permission';
import { Permission } from '../../../../common/permissions';
import { Header } from './Header';
import { Footer } from './component/Footer';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const canAuthenticateWithGoogle = checkPermission(
    user,
    Permission.GoogleAuthenticate,
  );

  const { data } = useCalendarIntegrationStatusQuery({
    skip: !canAuthenticateWithGoogle,
  });

  return (
    <>
      <Header />
      <Alert status="error">
        <AlertIcon />
        <AlertTitle> This is a testing site. </AlertTitle>
        <AlertDescription>
          This is a testing site for freeCodeCamp staff members and Chapter
          maintainers. Be mindful that your data will be deleted periodically.
        </AlertDescription>
      </Alert>
      {canAuthenticateWithGoogle &&
        data?.calendarIntegrationStatus === null && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle> Broken integration. </AlertTitle>
            <AlertDescription>
              Integration with Google Calendar is currently not working.
              Reauthenticate with Google Calendar in{' '}
              <Link href="/dashboard/calendar">Calendar dashboard</Link>.
            </AlertDescription>
          </Alert>
        )}
      <SkipNavContent />
      <Box
        as="main"
        minHeight={{ base: '70vh', '2xl': '82vh' }}
        px={[4, 4, 8, 16]}
        id="main-content"
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};
export default PageLayout;
