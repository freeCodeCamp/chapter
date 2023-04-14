import { Button, Heading, HStack, Grid, Spinner, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import NextError from 'next/error';
import React, { ReactElement, useMemo, useState } from 'react';

import { useConfirm } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import { SharePopOver } from '../../../../components/SharePopOver';
import { Card } from '../../../../components/Card';
import { InfoList } from '../../../../components/InfoList';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useCalendarIntegrationStatusQuery,
  useCreateChapterCalendarMutation,
  useDashboardChapterQuery,
  DashboardChapterQuery,
  useTestChapterCalendarAccessLazyQuery,
  useUnlinkChapterCalendarMutation,
} from '../../../../generated/graphql';
import { useAlert } from '../../../../hooks/useAlert';
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
import { meQuery } from '../../../auth/graphql/queries';
import { DASHBOARD_CHAPTER } from '../graphql/queries';
import { DASHBOARD_EVENT } from '../../Events/graphql/queries';

const eventRefetches = (data?: DashboardChapterQuery) => {
  return (
    data?.dashboardChapter.events.map(({ id: eventId }) => ({
      query: DASHBOARD_EVENT,
      variables: { eventId },
    })) ?? []
  );
};

export const ChapterPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');
  const { user, loadingUser } = useUser();
  const [displayUnlink, setDisplayUnlink] = useState(false);
  const [disableTest, setDisableTest] = useState(false);

  const { loading, error, data } = useDashboardChapterQuery({
    variables: { chapterId },
  });

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery();
  const [createChapterCalendar, { loading: loadingCalendar }] =
    useCreateChapterCalendarMutation();
  const [unlinkChapterCalendar, { loading: loadingUnlink }] =
    useUnlinkChapterCalendarMutation();
  const [testChapterCalendarAccess, { loading: loadingTest }] =
    useTestChapterCalendarAccessLazyQuery();

  const confirm = useConfirm();
  const addAlert = useAlert();

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
            { query: meQuery },
          ],
        });
        addAlert({ title: 'Chapter calendar created', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

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
            ...eventRefetches(data),
          ],
        });
        addAlert({ title: 'Chapter calendar unlinked', status: 'success' });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
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

  const fields = [
    { value: data.dashboardChapter.description, label: 'Description' },
    { value: data.dashboardChapter.city, label: 'City' },
    { value: data.dashboardChapter.region, label: 'Region' },
    { value: data.dashboardChapter.country, label: 'Country' },
    { value: data.dashboardChapter.category, label: 'Category' },
    { value: data.dashboardChapter.banner_url, label: 'Banner' },
    { value: data.dashboardChapter.logo_url, label: 'Logo' },
    { value: data.dashboardChapter.chat_url, label: 'Chat' },
  ];

  const integrationStatus = dataStatus?.calendarIntegrationStatus;
  const textStyle = { fontSize: { base: 'md', md: 'lg' }, fontWeight: 'bold' };
  return (
    <>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Grid gap="1rem">
            <Heading
              fontSize={{ base: 'xl', md: 'xx-large' }}
              as="h1"
              fontWeight={{ base: 'bold', md: 'semi-bold' }}
              marginBlock={'1'}
            >
              Chapter: {data.dashboardChapter.name}
            </Heading>
            {fields.map(
              ({ value, label }) =>
                value && (
                  <Text {...textStyle} key={label}>
                    {label}: {value}
                  </Text>
                ),
            )}
          </Grid>
          {integrationStatus !== false && (
            <HStack>
              <Text {...textStyle}>Calendar created:</Text>
              {loadingCalendar ? (
                <Spinner size="sm" />
              ) : data.dashboardChapter.has_calendar ? (
                <>
                  <CheckIcon boxSize="5" />
                  {checkInstancePermission(user, Permission.ChapterCreate) && (
                    <>
                      <Button
                        isDisabled={disableTest}
                        isLoading={loadingTest}
                        onClick={onTestCalendar}
                      >
                        Test access
                      </Button>
                      {displayUnlink && (
                        <Button
                          isLoading={loadingUnlink}
                          onClick={onUnlinkCalendar}
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
              !data.dashboardChapter.has_calendar &&
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
