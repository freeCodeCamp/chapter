import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useDisclosure,
  useToast,
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
import { DashboardLoading } from '../../../shared/components/DashboardLoading';
import { Layout } from '../../../shared/components/Layout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../../shared/components/RoleChangeModal';
import { useParam } from '../../../../../hooks/useParam';
import { DASHBOARD_CHAPTER_USERS } from '../../graphql/queries';
import { NextPageWithLayout } from '../../../../../pages/_app';

export const ChapterUsersPage: NextPageWithLayout = () => {
  const { param: chapterId } = useParam('id');

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
  const toast = useToast();

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
        toast({ title: 'User was banned', status: 'success' });
      } catch (err) {
        if (err instanceof Error) {
          toast({ title: err.message, status: 'error' });
        } else {
          toast({ title: 'Something went wrong', status: 'error' });
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
        toast({ title: 'User was unbanned', status: 'success' });
      } catch (err) {
        if (err instanceof Error) {
          toast({ title: err.message, status: 'error' });
        } else {
          toast({ title: 'Something went wrong', status: 'error' });
        }
      }
    }
  };

  const bans = useMemo(
    () => new Set(data?.dashboardChapter?.user_bans.map((ban) => ban.user.id)),
    [data?.dashboardChapter?.chapter_users, data?.dashboardChapter?.user_bans],
  );

  const isLoading = loading || !data;
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
          <Heading id="page-heading">Chapter Users</Heading>
        </Flex>
        <Box display={{ base: 'none', lg: 'block' }}>
          <DataTable
            data={data.dashboardChapter.chapter_users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'role', 'actions'] as const}
            mapper={{
              name: ({ user }) => (
                <HStack>
                  <Text data-cy="userName">{user.name}</Text>
                  {bans.has(user.id) && (
                    <Badge data-cy="isBanned" colorScheme="red">
                      Banned
                    </Badge>
                  )}
                </HStack>
              ),
              actions: ({ is_bannable, user, chapter_role }) => (
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
                  </Button>
                  {is_bannable &&
                    (bans.has(user.id) ? (
                      <Button
                        data-cy="unbanUser"
                        colorScheme="purple"
                        size="xs"
                        onClick={() => onUnban(user)}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        data-cy="banUser"
                        colorScheme="red"
                        size="xs"
                        onClick={() => onBan(user)}
                      >
                        Ban
                      </Button>
                    ))}
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
                            <Text>{user.name}</Text>
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
                            </Button>
                            {is_bannable &&
                              (bans.has(user.id) ? (
                                <Button
                                  data-cy="unbanUser"
                                  colorScheme="purple"
                                  size="xs"
                                  onClick={() => onUnban(user)}
                                >
                                  Unban
                                </Button>
                              ) : (
                                <Button
                                  data-cy="banUser"
                                  colorScheme="red"
                                  size="xs"
                                  onClick={() => onBan(user)}
                                >
                                  Ban
                                </Button>
                              ))}
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
  return <Layout>{page}</Layout>;
};
