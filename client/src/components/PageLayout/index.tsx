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

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const canAuthenticateWithGoogle = checkPermission(
    user,
    Permission.GoogleAuthenticate,
  );
  const { data } = useCalendarIntegrationStatusQuery();
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
        {canAuthenticateWithGoogle &&
          data?.calendarIntegrationStatus === null && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle> Broken integration. </AlertTitle>
              <AlertDescription>
                Integration with Google Calendar is currently not working.
                Authenticate again in{' '}
                <Link href="/dashboard/calendar">Calendar dashboard</Link>.
              </AlertDescription>
            </Alert>
          )}
        {children}
      </Box>
    </>
  );
};
export default PageLayout;
