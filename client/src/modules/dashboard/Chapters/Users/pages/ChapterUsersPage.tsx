import {
  Badge,
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
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import { useConfirm } from 'chakra-confirm';
import {
  useBanUserMutation,
  useChapterUsersQuery,
  useChapterRolesQuery,
  useChangeChapterUserRoleMutation,
  useUnbanUserMutation,
} from '../../../../../generated/graphql';
import { Layout } from '../../../shared/components/Layout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../../shared/components/RoleChangeModal';
import { getId } from '../../../../../util/getId';
import { CHAPTER_USERS } from '../../../../chapters/graphql/queries';

export const ChapterUsersPage: NextPage = () => {
  const router = useRouter();

  const chapterId = getId(router.query) || -1;

  const { loading, error, data } = useChapterUsersQuery({
    variables: { chapterId },
  });
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
        console.error(err);
        toast({ title: 'Something went wrong', status: 'error' });
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
        console.error(err);
        toast({ title: 'Something went wrong', status: 'error' });
      }
    }
  };

  const bans = useMemo(
    () => new Set(data?.chapter?.user_bans.map((ban) => ban.user.id)),
    [data?.chapter?.chapter_users, data?.chapter?.user_bans],
  );

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
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.chapter?.chapter_users ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={data.chapter.chapter_users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'email', 'role', 'ops'] as const}
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
              ops: ({ canBeBanned, user, chapter_role }) => (
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
        )}
      </VStack>
    </Layout>
  );
};
