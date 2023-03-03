import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import NextError from 'next/error';
import React, { ReactElement, useMemo, useState } from 'react';

import { useConfirm } from 'chakra-confirm';
import {
  useBanUserMutation,
  useChapterRolesQuery,
  useChangeChapterUserRoleMutation,
  useUnbanUserMutation,
  useDashboardChapterUsersQuery,
} from '../../../../../generated/graphql';
import { useAlert } from '../../../../../hooks/useAlert';
import UserName from '../../../../../components/UserName';
import { DashboardLoading } from '../../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../../shared/components/RoleChangeModal';
import { useParam } from '../../../../../hooks/useParam';
import { DASHBOARD_CHAPTER_USERS } from '../../graphql/queries';
import { NextPageWithLayout } from '../../../../../pages/_app';
import { checkInstancePermission } from '../../../../../util/check-permission';
import { Permission } from '../../../../../../../common/permissions';
import { useUser } from '../../../../auth/user';

export const ChapterUsersPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');
  const { user, loadingUser } = useUser();

  const { loading, error, data } = useDashboardChapterUsersQuery({
    variables: { chapterId },
  });

  const { data: chapterRoles } = useChapterRolesQuery();
  const modalProps = useDisclosure();

  const [chapterUser, setChapterUser] = useState<RoleChangeModalData>();

  const refetch = {
    refetchQueries: [
      { query: DASHBOARD_CHAPTER_USERS, variables: { chapterId } },
    ],
  };

  const [changeRoleMutation] = useChangeChapterUserRoleMutation(refetch);

  const changeRole = (data: RoleChangeModalData) => {
    setChapterUser(data);
    modalProps.onOpen();
  };
  const onModalSubmit = async (data: {
    newRoleName: string;
    userId: number;
  }) => {
    changeRoleMutation({
      variables: {
        chapterId: chapterId,
        roleName: data.newRoleName,
        userId: data.userId,
      },
    });
    modalProps.onClose();
  };

  const [banUser] = useBanUserMutation(refetch);
  const [unbanUser] = useUnbanUserMutation(refetch);

  const confirm = useConfirm();
  const addAlert = useAlert();

  interface BanArgs {
    id: number;
    name: string;
  }

  const onBan = async ({ id: userId, name: userName }: BanArgs) => {
    const ok = await confirm({
      buttonColor: 'red',
      body: `Are you sure you want to ban ${userName}? This will revoke their chapter permissions and remove them from all events in this chapter.`,
    });

    if (ok) {
      try {
        await banUser({ variables: { userId, chapterId } });
        addAlert({ title: 'User was banned', status: 'success' });
      } catch (err) {
        if (err instanceof Error) {
          addAlert({ title: err.message, status: 'error' });
        } else {
          addAlert({ title: 'Something went wrong', status: 'error' });
        }
      }
    }
  };

  const onUnban = async ({ id: userId, name: userName }: BanArgs) => {
    const ok = await confirm({
      buttonColor: 'red',
      body: `Are you sure you want to unban ${userName}`,
    });

    if (ok) {
      try {
        await unbanUser({ variables: { userId, chapterId } });
        addAlert({ title: 'User was unbanned', status: 'success' });
      } catch (err) {
        if (err instanceof Error) {
          addAlert({ title: err.message, status: 'error' });
        } else {
          addAlert({ title: 'Something went wrong', status: 'error' });
        }
      }
    }
  };

  const bans = useMemo(
    () =>
      new Set(data?.dashboardChapter?.user_bans.map(({ user_id }) => user_id)),
    [data?.dashboardChapter?.chapter_users, data?.dashboardChapter?.user_bans],
  );

  const isLoading = loading || !data || loadingUser;
  if (isLoading || error) return <DashboardLoading error={error} />;
  if (!data.dashboardChapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <>
      {chapterRoles && chapterUser && (
        <RoleChangeModal
          modalProps={modalProps}
          data={chapterUser}
          roles={chapterRoles.chapterRoles.map(({ id, name }) => ({
            id,
            name,
          }))}
          title="Change chapter role"
          onSubmit={onModalSubmit}
        />
      )}
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">
            {data.dashboardChapter.name} Users
          </Heading>
        </Flex>
        <Box display={{ base: 'none', lg: 'block' }} width={'100%'}>
          <DataTable
            data={data.dashboardChapter.chapter_users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'role', 'actions'] as const}
            mapper={{
              name: ({ user }) => (
                <HStack>
                  <UserName user={user} />
                  {bans.has(user.id) && (
                    <Badge data-cy="isBanned" colorScheme="red">
                      Banned
                    </Badge>
                  )}
                </HStack>
              ),
              actions: ({ is_bannable, user: otherUser, chapter_role }) => (
                <HStack>
                  {checkInstancePermission(
                    user,
                    Permission.ChapterUserRoleChange,
                  ) && (
                    <Button
                      data-cy="changeRole"
                      colorScheme="blue"
                      size="xs"
                      onClick={() =>
                        changeRole({
                          roleName: chapter_role.name,
                          userId: otherUser.id,
                          userName: otherUser.name,
                        })
                      }
                    >
                      Change
                      <Text srOnly as="span">
                        role of {otherUser.name}
                      </Text>
                    </Button>
                  )}
                  {bans.has(otherUser.id) ? (
                    <Tooltip
                      hasArrow
                      label={
                        !is_bannable && `You can't unban other administrators.`
                      }
                      bg="gray.10"
                      color="gray.90"
                    >
                      <Button
                        data-cy="unbanUser"
                        colorScheme="purple"
                        size="xs"
                        isDisabled={!is_bannable}
                        onClick={() => onUnban(otherUser)}
                      >
                        Unban
                        <Text srOnly as="span">
                          {otherUser.name}
                        </Text>
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      hasArrow
                      label={
                        is_bannable
                          ? `Block user from interacting with this Chapter`
                          : `To ban this user, reach out to an instance owner`
                      }
                      bg="gray.10"
                      color="gray.90"
                    >
                      <Button
                        data-cy="banUser"
                        colorScheme="red"
                        size="xs"
                        isDisabled={!is_bannable}
                        onClick={() => onBan(otherUser)}
                      >
                        Ban
                        <Text srOnly as="span">
                          {otherUser.name}
                        </Text>
                      </Button>
                    </Tooltip>
                  )}
                </HStack>
              ),
              role: ({ chapter_role: { name } }) => (
                <Text data-cy="role">{name}</Text>
              ),
            }}
          />
        </Box>
        <Box display={{ base: 'block', lg: 'none' }}>
          {data.dashboardChapter.chapter_users.map(
            ({ is_bannable, user, chapter_role }, index) => (
              <Flex key={index} marginBlock={'2em'}>
                {data.dashboardChapter ? (
                  <DataTable
                    data={[data.dashboardChapter.chapter_users[index]]}
                    keys={['type', 'actions'] as const}
                    showHeader={false}
                    tableProps={{
                      table: { 'aria-labelledby': 'page-heading' },
                    }}
                    mapper={{
                      type: () => (
                        <VStack
                          spacing={3}
                          align={'flex-start'}
                          marginBlock={'1em'}
                        >
                          <Text fontWeight={700}>Name</Text>
                          <Text fontWeight={700}>Actions</Text>
                          <Text fontWeight={700}>Role</Text>
                        </VStack>
                      ),
                      actions: () => (
                        <VStack spacing={3} align={'flex-start'}>
                          <HStack>
                            <UserName user={user} />
                            {bans.has(user.id) && (
                              <Badge data-cy="isBanned" colorScheme="red">
                                Banned
                              </Badge>
                            )}
                          </HStack>
                          <HStack>
                            <Button
                              data-cy="changeRole"
                              colorScheme="blue"
                              size="xs"
                              onClick={() =>
                                changeRole({
                                  roleName: chapter_role.name,
                                  userId: user.id,
                                  userName: user.name,
                                })
                              }
                            >
                              Change
                              <Text srOnly as="span">
                                role of {user.name}
                              </Text>
                            </Button>
                            (bans.has(user.id) ? (
                            <Tooltip
                              hasArrow
                              label={
                                !is_bannable &&
                                `You can't unban other administrators.`
                              }
                              bg="gray.10"
                              color="gray.90"
                            >
                              <Button
                                data-cy="unbanUser"
                                colorScheme="purple"
                                size="xs"
                                isDisabled={!is_bannable}
                                onClick={() => onUnban(user)}
                              >
                                Unban
                                <Text srOnly as="span">
                                  {user.name}
                                </Text>
                              </Button>
                            </Tooltip>
                            ) : (
                            <Tooltip
                              hasArrow
                              label={
                                is_bannable
                                  ? `Block user from interacting with this Chapter`
                                  : `To ban this user, reach out to an instance owner`
                              }
                              bg="gray.300"
                              color="black"
                            >
                              <Button
                                data-cy="banUser"
                                colorScheme="red"
                                size="xs"
                                isDisabled={!is_bannable}
                                onClick={() => onBan(user)}
                              >
                                Ban
                                <Text srOnly as="span">
                                  {user.name}
                                </Text>
                              </Button>
                            </Tooltip>
                            ))
                          </HStack>
                          <Text data-cy="role">{chapter_role.name}</Text>
                        </VStack>
                      ),
                    }}
                  />
                ) : (
                  <Text>PlaceHolder for inviting users</Text>
                )}
              </Flex>
            ),
          )}
        </Box>
      </VStack>
    </>
  );
};

ChapterUsersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
