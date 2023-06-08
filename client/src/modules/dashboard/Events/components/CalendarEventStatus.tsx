import { Button, HStack, Spinner, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useConfirm } from 'chakra-confirm';

import {
  useTestEventCalendarEventAccessLazyQuery,
  useUnlinkCalendarEventMutation,
} from '../../../.../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
import { InfoList } from '../../../../components/InfoList';
import { DASHBOARD_EVENT } from '../graphql/queries';
import {
  ChapterPermission,
  Permission,
} from '../../../../../../common/permissions';

interface CalendarEventStatusProps {
  checkChapterPermission: (permission: ChapterPermission) => boolean;
  event: { has_calendar_event: boolean; id: number };
  loadingCalendar: boolean;
}

export const CalendarEventStatus = ({
  checkChapterPermission,
  event: { has_calendar_event, id: eventId },
  loadingCalendar,
}: CalendarEventStatusProps) => {
  const [disableTest, setDisableTest] = useState(false);
  const [displayUnlink, setDisplayUnlink] = useState(false);

  const [testEventCalendarAccess, { loading: loadingTest }] =
    useTestEventCalendarEventAccessLazyQuery();
  const [unlinkCalendarEvent, { loading: loadingUnlinkEvent }] =
    useUnlinkCalendarEventMutation();

  const addAlert = useAlert();
  const confirm = useConfirm();

  const onTestCalendarEvent = async () => {
    const ok = await confirm({
      title: 'Test access to calendar event',
      body: (
        <>
          Do you want to test access to Google calendar event for this event?
          <InfoList
            items={[
              'We will try to access linked Google calendar event.',
              'If Google calendar event no longer exists, or cannot be accessed, you will have option to unlink it.',
            ]}
          />
        </>
      ),
    });
    if (ok) {
      setDisableTest(true);
      try {
        const { data } = await testEventCalendarAccess({
          variables: { eventId },
        });
        if (data?.testEventCalendarEventAccess) {
          addAlert({
            title: 'Calendar event test successful',
            status: 'success',
          });
        } else if (data?.testEventCalendarEventAccess === false) {
          addAlert({
            title: "Couldn't access the calendar event",
            status: 'error',
          });
          setDisplayUnlink(true);
        } else {
          addAlert({
            title:
              'Something went wrong, make sure integration is working, chapter calendar can be accessed, and try again',
            status: 'warning',
          });
        }
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const onUnlinkCalendarEvent = async () => {
    const ok = await confirm({
      title: 'Unlink calendar event',
      body: (
        <>
          Do you want to unlink current Google calendar event from this event?
          <InfoList
            items={['Unlinked Google calendar event will not be deleted.']}
          />
        </>
      ),
    });
    if (ok) {
      try {
        await unlinkCalendarEvent({
          variables: { eventId },
          refetchQueries: [{ query: DASHBOARD_EVENT, variables: { eventId } }],
        });
        addAlert({ title: 'Calendar event unlinked', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };
  return (
    <HStack>
      <Text>Event created in calendar:</Text>
      {loadingCalendar ? (
        <Spinner size="sm" />
      ) : has_calendar_event ? (
        <>
          <CheckIcon boxSize="5" />
          {checkChapterPermission(Permission.EventCreate) && (
            <>
              <Button
                isDisabled={disableTest}
                isLoading={loadingTest}
                onClick={onTestCalendarEvent}
              >
                Test access
              </Button>
              {displayUnlink && (
                <Button
                  isLoading={loadingUnlinkEvent}
                  onClick={onUnlinkCalendarEvent}
                >
                  Unlink
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <CloseIcon boxSize="4" />
      )}
    </HStack>
  );
};
