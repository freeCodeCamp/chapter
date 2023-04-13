import { Button, Grid } from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';
import React, { useMemo } from 'react';

import {
  InstancePermission,
  Permission,
} from '../../../../../../common/permissions';
import { SharePopOver } from '../../../../components/SharePopOver';
import {
  useCalendarIntegrationStatusQuery,
  useCreateChapterCalendarMutation,
} from '../../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
import { DASHBOARD_CHAPTER } from '../graphql/queries';
import {
  checkChapterPermission,
  checkInstancePermission,
} from '../../../../util/check-permission';
import { meQuery } from '../../../auth/graphql/queries';
import { useUser } from '../../../auth/user';
import { Loading } from '../../../../components/Loading';
import { CalendarStatus } from './CalendarStatus';
import { DeleteChapterButton } from './DeleteChapterButton';

interface ActionsProps {
  chapter: { id: number; events: { id: number }[]; has_calendar: boolean };
}

export const Actions = ({ chapter }: ActionsProps) => {
  const { id: chapterId, has_calendar } = chapter;
  const { user, loadingUser } = useUser();

  const confirm = useConfirm();
  const addAlert = useAlert();

  const [createChapterCalendar, { loading: loadingCalendar }] =
    useCreateChapterCalendarMutation();

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery();

  const actionLinks = [
    {
      colorScheme: 'blue',
      size: 'sm',
      href: `${chapterId}/new-event`,
      text: 'Add new event',
      dataCy: 'create-event',
      requiredPermission: Permission.EventCreate,
    },
    {
      colorScheme: 'blue',
      size: 'sm',
      href: `${chapterId}/new-venue`,
      text: 'Add new venue',
      dataCy: 'create-venue',
      requiredPermission: Permission.VenueCreate,
    },
    {
      colorScheme: 'blue',
      size: 'sm',
      href: `${chapterId}/edit`,
      text: 'Edit',
      dataCy: 'edit-chapter',
      requiredPermission: Permission.EventEdit,
    },
  ];

  const allowedActions = useMemo(
    () =>
      actionLinks.filter(
        ({ requiredPermission }) =>
          !requiredPermission ||
          checkChapterPermission(user, requiredPermission, { chapterId }),
      ),
    [actionLinks, chapterId, user],
  );

  const onCreateCalendar = async () => {
    const ok = await confirm({
      title: 'Create chapter calendar',
      body: 'Do you want to create Google calendar for this chapter?',
    });
    if (ok) {
      try {
        const { data } = await createChapterCalendar({
          variables: { chapterId },
          refetchQueries: [
            { query: DASHBOARD_CHAPTER, variables: { chapterId } },
            { query: meQuery },
          ],
        });
        if (!data?.createChapterCalendar.has_calendar) {
          addAlert({
            title:
              'Chapter calendar was not created. Make sure calendar integration is working and try again.',
            status: 'error',
          });
          return;
        }
        addAlert({ title: 'Chapter calendar created', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  if (loadingStatus || !dataStatus || loadingUser) return <Loading />;
  const integrationStatus = dataStatus.calendarIntegrationStatus;
  const checkInstancePartial = (permission: InstancePermission) =>
    checkInstancePermission(user, permission);

  return (
    <>
      {integrationStatus !== false && (
        <CalendarStatus
          chapter={chapter}
          checkInstancePermission={checkInstancePartial}
          loadingCalendar={loadingCalendar}
        />
      )}
      {checkChapterPermission(user, Permission.ChapterEdit, { chapterId }) && (
        <LinkButton href={`${chapterId}/users`} maxWidth="7.5rem">
          Chapter Users
        </LinkButton>
      )}
      <Grid
        gridTemplateColumns="repeat(auto-fill, minmax(7.5rem, 1fr))"
        gap="1em"
      >
        {allowedActions.map(({ colorScheme, size, href, text, dataCy }) => (
          <LinkButton
            key={text}
            colorScheme={colorScheme}
            size={size}
            href={href}
            data-cy={dataCy}
          >
            {text}
          </LinkButton>
        ))}
        <SharePopOver
          link={`${process.env.NEXT_PUBLIC_CLIENT_URL}/chapters/${chapterId}?ask_to_confirm=true`}
          size="sm"
        />
        {integrationStatus &&
          !has_calendar &&
          checkInstancePartial(Permission.ChapterCreate) && (
            <Button
              colorScheme="blue"
              isLoading={loadingCalendar}
              onClick={onCreateCalendar}
              size="sm"
            >
              Create calendar
            </Button>
          )}
        <DeleteChapterButton size="sm" chapterId={chapterId} />
      </Grid>
    </>
  );
};
