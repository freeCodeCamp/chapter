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
import { useUser } from '../../modules/auth/user';
import { checkInstancePermission } from '../../util/check-permission';
import { Permission } from '../../../../common/permissions';
import { Alerts } from '../Alerts/Alerts';
import { Header } from './Header';
import { Footer } from './component/Footer';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const canAuthenticateWithGoogle = checkInstancePermission(
    user,
    Permission.GoogleAuthenticate,
  );

  const { data } = useCalendarIntegrationStatusQuery({
    skip: !canAuthenticateWithGoogle,
  });

  return (
    <>
      <Header />
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
      <Alerts />
      <SkipNavContent />
      <Box
        as="main"
        minHeight={{ base: '70vh', md: '82vh' }}
        px={[4, 4, 8, 16]}
        id="main-content"
        marginTop="4"
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};
export default PageLayout;
