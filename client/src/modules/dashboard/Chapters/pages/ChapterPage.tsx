import { Box, Heading, HStack } from '@chakra-ui/react';
import NextError from 'next/error';
import React, { ReactElement, useMemo } from 'react';

import { LinkButton } from 'chakra-next-link';

import { SharePopOver } from '../../../../components/SharePopOver';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useDashboardChapterQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from '../../shared/components/EventList';
import { Layout } from '../../shared/components/Layout';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useAuth } from '../../../../modules/auth/store';
import { checkPermission } from '../../../../util/check-permission';
import { Permission } from '../../../../../../common/permissions';
import { DeleteChapterButton } from '../components/DeleteChapterButton';

export const ChapterPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');
  const { user, loadingUser } = useAuth();

  const { loading, error, data } = useDashboardChapterQuery({
    variables: { chapterId },
  });

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
          checkPermission(user, requiredPermission, { chapterId }),
      ),
    [actionLinks, chapterId, user],
  );

  const isLoading = loading || !data || loadingUser;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardChapter)
    return <NextError statusCode={404} title="Chapter not found" />;

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
          {checkPermission(user, Permission.UsersView, { chapterId }) && (
            <Box>
              <LinkButton href={`${chapterId}/users`} paddingBlock={'2'}>
                Chapter Users
              </LinkButton>
            </Box>
          )}
          <HStack mt={'2'}>
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
            <DeleteChapterButton chapterId={chapterId} />
          </HStack>
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
  return <Layout>{page}</Layout>;
};
