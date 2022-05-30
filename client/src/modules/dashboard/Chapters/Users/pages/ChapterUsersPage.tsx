import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useConfirm } from 'chakra-confirm';

import {
  useChapterUsersQuery,
  useBanUserMutation,
} from '../../../../../generated/graphql';
import { Layout } from '../../../shared/components/Layout';
import { getId } from '../../../../../util/getId';
import { CHAPTER_USERS } from '../../../../chapters/graphql/queries';

export const ChapterUsersPage: NextPage = () => {
  const router = useRouter();

  const id = getId(router.query) || -1;

  const { loading, error, data } = useChapterUsersQuery({
    variables: { id },
  });

  const [banUser] = useBanUserMutation({
    refetchQueries: [{ query: CHAPTER_USERS, variables: { id } }],
  });

  const confirm = useConfirm();
  const toast = useToast();

  const onBan = async ({
    id: userId,
    name: userName,
  }: {
    id: number;
    name: string;
  }) => {
    const ok = await confirm({
      buttonColor: 'red',
      body: `Are you sure you want to ban ${userName}?`,
    });

    if (ok) {
      try {
        await banUser({ variables: { userId: userId, chapterId: id } });
        toast({ title: 'User was banned', status: 'success' });
      } catch (err) {
        console.error(err);
        toast({ title: 'Something went wrong', status: 'error' });
      }
    }
  };

  return (
    <Layout>
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
              name: ({ isBanned, user }) => (
                <HStack>
                  <Text>{user.name}</Text>
                  {isBanned && <Badge colorScheme="red">Banned</Badge>}
                </HStack>
              ),
              email: ({ user }) => user.email,
              role: ({ chapter_role }) => chapter_role.name,
              ops: ({ canBeBanned, isBanned, user }) => {
                if (!isBanned && canBeBanned) {
                  return (
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={() => onBan(user)}
                    >
                      Ban
                    </Button>
                  );
                }
              },
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
