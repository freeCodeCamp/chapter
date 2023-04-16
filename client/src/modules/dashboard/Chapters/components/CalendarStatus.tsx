import { Button, HStack, Spinner, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useConfirm } from 'chakra-confirm';
import React, { useState } from 'react';

import {
  useTestChapterCalendarAccessLazyQuery,
  useUnlinkChapterCalendarMutation,
} from '../../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
import { DASHBOARD_EVENT } from '../../../dashboard/Events/graphql/queries';
import { InfoList } from '../../../../components/InfoList';
import { DASHBOARD_CHAPTER } from '../graphql/queries';
import {
  InstancePermission,
  Permission,
} from '../../../../../../common/permissions';

const eventRefetches = (events?: { id: number }[]) => {
  return (
    events?.map(({ id: eventId }) => ({
      query: DASHBOARD_EVENT,
      variables: { eventId },
    })) ?? []
  );
};

const textStyle = { fontSize: { base: 'md', md: 'lg' }, fontWeight: 'bold' };

interface CalendarStatusProps {
  chapter: {
    id: number;
    events: { id: number }[];
    has_calendar: boolean;
  };
  checkInstancePermission: (permission: InstancePermission) => boolean;
  loadingCalendar: boolean;
}

export const CalendarStatus = ({
  chapter: { events, has_calendar, id: chapterId },
  checkInstancePermission,
  loadingCalendar,
}: CalendarStatusProps) => {
  const [displayUnlink, setDisplayUnlink] = useState(false);
  const [disableTest, setDisableTest] = useState(false);

  const [unlinkChapterCalendar, { loading: loadingUnlink }] =
    useUnlinkChapterCalendarMutation();
  const [testChapterCalendarAccess, { loading: loadingTest }] =
    useTestChapterCalendarAccessLazyQuery();

  const confirm = useConfirm();
  const addAlert = useAlert();

  const onTestCalendar = async () => {
    const ok = await confirm({
      title: 'Test chapter calendar test',
      body: (
        <>
          Do you want to test access to Google calendar for this chapter?
          <InfoList
            items={[
              'We will try to access linked Google calendar.',
              'If Google calendar no longer exists, or cannot be accessed, you will have option to unlink it.',
            ]}
          />
        </>
      ),
    });
    if (ok) {
      setDisableTest(true);
      try {
        const { data } = await testChapterCalendarAccess({
          variables: { chapterId },
        });
        if (data?.testChapterCalendarAccess) {
          addAlert({
            title: 'Calendar access test successful',
            status: 'success',
          });
        } else if (data?.testChapterCalendarAccess === false) {
          addAlert({ title: "Couldn't access the calendar", status: 'error' });
          setDisplayUnlink(true);
        } else {
          addAlert({
            title:
              'Something went wrong, make sure integration is working and try again',
            status: 'warning',
          });
        }
      } catch (error) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.log(error);
      }
    }
  };

  const onUnlinkCalendar = async () => {
    const ok = await confirm({
      title: 'Unlink chapter calendar',
      body: (
        <>
          Do you want to unlink current Google calendar from this chapter?
          <InfoList
            items={[
              'All events in this chapter will have Google calendar events unlinked as well.',
              'Unlinked Google calendar will not be deleted.',
            ]}
          />
        </>
      ),
    });
    if (ok) {
      try {
        await unlinkChapterCalendar({
          variables: { chapterId },
          refetchQueries: [
            { query: DASHBOARD_CHAPTER, variables: { chapterId } },
            ...eventRefetches(events),
          ],
        });
        addAlert({ title: 'Chapter calendar unlinked', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  return (
    <HStack>
      <Text {...textStyle}>Calendar created:</Text>
      {loadingCalendar ? (
        <Spinner size="sm" />
      ) : has_calendar ? (
        <>
          <CheckIcon boxSize="5" />
          {checkInstancePermission(Permission.ChapterCreate) && (
            <>
              <Button
                isDisabled={disableTest}
                isLoading={loadingTest}
                onClick={onTestCalendar}
              >
                Test access
              </Button>
              {displayUnlink && (
                <Button isLoading={loadingUnlink} onClick={onUnlinkCalendar}>
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
