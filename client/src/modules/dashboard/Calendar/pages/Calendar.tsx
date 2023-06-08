import { Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import NextError from 'next/error';
import React, { ReactElement } from 'react';

import {
  useCalendarIntegrationStatusQuery,
  useCalendarIntegrationTestMutation,
  useTokenStatusesQuery,
} from '../../../../generated/graphql';
import { checkInstancePermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { useUser } from '../../../auth/user';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { DashboardLoading } from '../../../../modules/dashboard/shared/components/DashboardLoading';
import { NextPageWithLayout } from '../../../../pages/_app';
import { CALENDAR_INTEGRATION, TOKEN_STATUSES } from '../graphql/queries';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const Calendar: NextPageWithLayout = () => {
  const { user } = useUser();
  const canAuthenticateWithGoogle = checkInstancePermission(
    user,
    Permission.GoogleAuthenticate,
  );
  const { loading, error, data } = useCalendarIntegrationStatusQuery();
  const {
    loading: loadingStatuses,
    error: errorStatuses,
    data: dataStatuses,
  } = useTokenStatusesQuery();
  const [calendarIntegrationTest, { loading: loadingTest }] =
    useCalendarIntegrationTestMutation({
      refetchQueries: [
        { query: CALENDAR_INTEGRATION },
        { query: TOKEN_STATUSES },
      ],
    });
  const isLoading = loading || loadingStatuses;
  if (isLoading || error || errorStatuses)
    return <DashboardLoading error={error || errorStatuses} />;

  if (!canAuthenticateWithGoogle)
    return <NextError statusCode={403} title="Access denied" />;

  const isAuthenticated = data?.calendarIntegrationStatus;
  const isBroken = isAuthenticated === null;
  return (
    <>
      <Heading as="h1" marginBlock={'.5em'}>
        Integration with Google Calendar
      </Heading>
      <Flex flexDirection={'column'} gap=".5em">
        <p>
          Chapter is designed to work with Google Calendar. It can automatically
          create calendars when you create new chapters and calendar events when
          you create new events in a chapter.
        </p>
        <p>
          Since you can create many chapters, each with multiple events, we
          recommend that you create a new Google account to use with Chapter.
          This way you can keep your personal calendar separate from the
          calendars for your chapters.
        </p>
        <p>
          Once you have decided which account you want to use, click the button
          below to grant Chapter access to it. You will be redirected to Google
          and asked to grant Chapter the permissions it needs to manage
          calendars and events.
        </p>
      </Flex>
      <HStack>
        <LinkButton
          as="div"
          href={new URL('/authenticate-with-google', serverUrl).href}
          fontWeight="600"
          background={'gray.85'}
          color={'gray.10'}
          height={'100%'}
          marginBlock={'1em'}
          borderRadius={'5px'}
          paddingBlock={'.65em'}
          _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          isDisabled={!!isAuthenticated}
        >
          {isAuthenticated
            ? 'Authenticated'
            : isBroken
            ? 'Reauthenticate with Google'
            : 'Authenticate with Google'}
        </LinkButton>
        {(isAuthenticated || isBroken) && (
          <Button
            onClick={() => calendarIntegrationTest()}
            isLoading={loadingTest}
          >
            Test integration
          </Button>
        )}
      </HStack>
      {(isAuthenticated || isBroken) &&
        !!dataStatuses?.tokenStatuses?.length && (
          <DataTable
            title="Authentication status"
            data={dataStatuses.tokenStatuses}
            keys={['email', 'token status'] as const}
            mapper={{
              email: ({ redacted_email }) => redacted_email,
              'token status': ({ is_valid }) => (
                <Text color={is_valid ? 'green.500' : 'red.500'}>
                  {is_valid ? 'valid' : 'invalid'}
                </Text>
              ),
            }}
          />
        )}
    </>
  );
};

Calendar.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
