import {
  Button,
  Heading,
  HStack,
  Grid,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import NextError from 'next/error';
import React, { ReactElement, useMemo } from 'react';

import { useConfirm } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import { SharePopOver } from '../../../../components/SharePopOver';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useCalendarIntegrationStatusQuery,
  useCreateChapterCalendarMutation,
  useDashboardChapterQuery,
} from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useUser } from '../../../auth/user';
import {
  checkChapterPermission,
  checkInstancePermission,
} from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { DeleteChapterButton } from '../components/DeleteChapterButton';
import { DASHBOARD_CHAPTER } from '../graphql/queries';

export const ChapterPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');
  const { user, loadingUser } = useUser();

  const { loading, error, data } = useDashboardChapterQuery({
    variables: { chapterId },
  });

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery();
  const [createChapterCalendar, { loading: loadingCalendar }] =
    useCreateChapterCalendarMutation();

  const confirm = useConfirm();
  const toast = useToast();

  const onCreateCalendar = async () => {
    const ok = await confirm({
      title: 'Create chapter calendar',
      body: 'Do you want to create Google calendar for this chapter?',
    });
    if (ok) {
      try {
        await createChapterCalendar({
          variables: { chapterId },
          refetchQueries: [
            { query: DASHBOARD_CHAPTER, variables: { chapterId } },
          ],
        });
        toast({ title: 'Chapter calendar created', status: 'success' });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

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

  const isLoading = loading || !data || loadingUser || loadingStatus;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardChapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  const integrationStatus = dataStatus?.calendarIntegrationStatus;

  return (
    <>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Heading
            fontSize={'md'}
            as="h1"
            fontWeight="semibold"
            marginBlock={'2'}
          >
            {data.dashboardChapter.name}
          </Heading>
          {integrationStatus !== false && (
            <HStack>
              <Text>Calendar created:</Text>
              {loadingCalendar ? (
                <Spinner size="sm" />
              ) : data.dashboardChapter.calendar_id ? (
                <CheckIcon boxSize="5" />
              ) : (
                <CloseIcon boxSize="4" />
              )}
            </HStack>
          )}
          {checkChapterPermission(user, Permission.ChapterEdit, {
            chapterId,
          }) && (
            <LinkButton
              href={`${chapterId}/users`}
              paddingBlock="2"
              marginBlock="1.5em"
            >
              Chapter Users
            </LinkButton>
          )}
          <Grid
            gridTemplateColumns="repeat(auto-fill, minmax(6.5rem, 1fr))"
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
              !data.dashboardChapter.calendar_id &&
              checkInstancePermission(user, Permission.ChapterCreate) && (
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
        </ProgressCardContent>
      </Card>
      <EventList
        title="Organized Events"
        events={data.dashboardChapter.events}
      />
    </>
  );
};

ChapterPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
