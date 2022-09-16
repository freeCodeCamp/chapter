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
import { NextPage } from 'next';
import React, { useEffect, useMemo, useState } from 'react';

import { useConfirm } from 'chakra-confirm';
import {
  useBanUserMutation,
  useChapterUsersLazyQuery,
  useChapterRolesQuery,
  useChangeChapterUserRoleMutation,
  useUnbanUserMutation,
} from '../../../../../generated/graphql';
import { Loading } from '../../../shared/components/Loading';
import { Layout } from '../../../shared/components/Layout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../../shared/components/RoleChangeModal';
import { useParam } from '../../../../../hooks/useParam';
import { CHAPTER_USERS } from '../../../../chapters/graphql/queries';

export const ChapterUsersPage: NextPage = () => {
  const { param: chapterId, isReady } = useParam('id');

  const [getChapterUsers, { loading, error, data }] = useChapterUsersLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) getChapterUsers();
  }, [isReady]);

  const { data: chapterRoles } = useChapterRolesQuery();
  const modalProps = useDisclosure();

  const [chapterUser, setChapterUser] = useState<RoleChangeModalData>();

  const refetch = {
    refetchQueries: [{ query: CHAPTER_USERS, variables: { chapterId } }],
  };

  const [changeRoleMutation] = useChangeChapterUserRoleMutation(refetch);

  const changeRole = (data: RoleChangeModalData) => {
    setChapterUser(data);
    modalProps.onOpen();
  };
  const onModalSubmit = async (data: { newRoleId: number; userId: number }) => {
    changeRoleMutation({
      variables: {
        chapterId: chapterId,
        roleId: data.newRoleId,
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
      body: `Are you sure you want to ban ${userName}?`,
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
    () => new Set(data?.chapter?.user_bans.map((ban) => ban.user.id)),
    [data?.chapter?.chapter_users, data?.chapter?.user_bans],
  );

  const isLoading = loading || !isReady || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;
  // TODO: render something nicer if this happens. A 404 page?

  if (!data.chapter) return <div> Chapter not found</div>;

  return (
    <Layout>
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
            data={data.chapter.chapter_users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'email', 'role', 'actions'] as const}
            mapper={{
              name: ({ user }) => (
                <HStack>
                  <Text>{user.name}</Text>
                  {bans.has(user.id) && (
                    <Badge data-cy="isBanned" colorScheme="red">
                      Banned
                    </Badge>
                  )}
                </HStack>
              ),
              email: ({ user }) => user.email,
              actions: ({ canBeBanned, user, chapter_role }) => (
                <HStack>
                  <Button
                    data-cy="changeRole"
                    colorScheme="blue"
                    size="xs"
                    onClick={() =>
                      changeRole({
                        roleId: chapter_role.id,
                        userId: user.id,
                        userName: user.name,
                      })
                    }
                  >
                    Change
                  </Button>
                  {canBeBanned &&
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
          {data.chapter.chapter_users.map(
            ({ canBeBanned, user, chapter_role }, index) => (
              <Flex key={index} marginBlock={'2em'}>
                {data.chapter ? (
                  <DataTable
                    data={[data.chapter.chapter_users[index]]}
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
                          <Text fontWeight={700}>Email</Text>
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
                          <Text>{user.email}</Text>
                          <HStack>
                            <Button
                              data-cy="changeRole"
                              colorScheme="blue"
                              size="xs"
                              onClick={() =>
                                changeRole({
                                  roleId: chapter_role.id,
                                  userId: user.id,
                                  userName: user.name,
                                })
                              }
                            >
                              Change
                            </Button>
                            {canBeBanned &&
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
    </Layout>
  );
};
