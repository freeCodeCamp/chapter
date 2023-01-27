import {
  Button,
  Heading,
  HStack,
  Grid,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import NextError from 'next/error';
import React, { ReactElement, useMemo, useState } from 'react';

import { useConfirm } from 'chakra-confirm';
import { LinkButton } from 'chakra-next-link';

import { SharePopOver } from '../../../../components/SharePopOver';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import {
  useCalendarIntegrationStatusQuery,
  useCreateChapterCalendarMutation,
  useDashboardChapterQuery,
  DashboardChapterQuery,
  useTestChapterCalendarAccessLazyQuery,
  useUnlinkChapterCalendarMutation,
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

  const onTestCalendar = async () => {
    const ok = await confirm({
      title: 'Test chapter calendar test',
      body: (
        <>
          Do you want to test access to Google calendar for this chapter?
          <List>
            <ListItem>
              <ListIcon as={InfoIcon} boxSize={5} />
              We will try to access linked Google calendar.
            </ListItem>
            <ListItem>
              <ListIcon as={InfoIcon} boxSize={5} />
              If Google calendar no longer exists, or cannot be accessed, you
              will have option to unlink it.
            </ListItem>
          </List>
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
          toast({
            title: 'Calendar access test successful',
            status: 'success',
          });
        } else if (data?.testChapterCalendarAccess === false) {
          toast({ title: "Couldn't access the calendar", status: 'error' });
          setDisplayUnlink(true);
        } else {
          toast({
            title:
              'Something went wrong, make sure integration is working and try again',
            status: 'warning',
          });
        }
      } catch (error) {
        toast({ title: 'Something went wrong', status: 'error' });
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
          <List>
            <ListItem>
              <ListIcon as={InfoIcon} boxSize={5} />
              All events in this chapter will have Google calendar events
              unlinked as well.
            </ListItem>
            <ListItem>
              <ListIcon as={InfoIcon} boxSize={5} />
              Unlinked Google calendar will not be deleted.
            </ListItem>
          </List>
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
        toast({ title: 'Chapter calendar unlinked', status: 'success' });
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
