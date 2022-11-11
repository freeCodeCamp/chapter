import React, { ReactElement } from 'react';
import NextError from 'next/error';
import { LinkButton } from 'chakra-next-link';
import { Heading } from '@chakra-ui/layout';
import { checkPermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { useAuth } from '../../../auth/store';
import { Layout } from '../../shared/components/Layout';
import { NextPageWithLayout } from '../../../../pages/_app';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const Calendar: NextPageWithLayout = () => {
  const { user } = useAuth();
  const canAuthenticateWithGoogle = checkPermission(
    user,
    Permission.GoogleAuthenticate,
  );
  return (
    <>
      {canAuthenticateWithGoogle ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            Integration with Google Calendar
          </Heading>
          <Box>
            <p>
              Chapter is designed to work with Google Calendar. It can
              automatically create calendars when you create new chapters and
              calendar events when you create new events in a chapter.
            </p>
            <p>
              Since you can create many chapters, each with multiple events, we
              recommend that you create a new Google account to use with
              Chapter. This way you can keep your personal calendar separate
              from the calendars for your chapters.
            </p>
            <p>
              Once you have decided which account you want to use, click the
              button below to grant Chapter access to it. You will be redirected
              to Google and asked to grant Chapter the permissions it needs to
              manage calendars and events.
            </p>
          </Box>
          <LinkButton
            as="a"
            href={new URL('/authenticate-with-google', serverUrl).href}
            fontWeight="600"
            background={'gray.85'}
            color={'gray.10'}
            height={'100%'}
            marginLeft={'1em'}
            borderRadius={'5px'}
            paddingBlock={'.65em'}
            _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          >
            Authenticate with Google
          </LinkButton>
        </>
      ) : (
        <NextError statusCode={403} title="Access denied" />;
      )}
    </>
  );
};

Calendar.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
