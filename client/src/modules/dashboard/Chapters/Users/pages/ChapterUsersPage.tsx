import {
  VStack,
  Flex,
  Text,
  Heading,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  useChapterUsersQuery,
  useChapterRolesQuery,
  useChangeChapterUserRoleMutation,
} from '../../../../../generated/graphql';
import { Layout } from '../../../shared/components/Layout';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../../shared/components/RoleChangeModal';
import { getId } from '../../../../../util/getId';
import { CHAPTER_USERS } from 'modules/chapters/graphql/queries';

export const ChapterUsersPage: NextPage = () => {
  const router = useRouter();

  const id = getId(router.query) || -1;

  const { loading, error, data } = useChapterUsersQuery({
    variables: { id },
  });
  const { data: chapterRoles } = useChapterRolesQuery();
  const modalProps = useDisclosure();

  const [chapterUser, setChapterUser] = useState<RoleChangeModalData>();

  const [changeRoleMutation] = useChangeChapterUserRoleMutation({
    refetchQueries: [{ query: CHAPTER_USERS, variables: { id: id } }],
  });

  const changeRole = (data: RoleChangeModalData) => {
    setChapterUser(data);
    modalProps.onOpen();
  };
  const onModalSubmit = async (data: { newRoleId: number; userId: number }) => {
    changeRoleMutation({
      variables: {
        chapterId: id,
        roleId: data.newRoleId,
        userId: data.userId,
      },
    });
    modalProps.onClose();
  };

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
            keys={['name', 'email', 'role', 'change role'] as const}
            mapper={{
              name: ({ user }) => user.name,
              email: ({ user }) => user.email,
              role: ({ chapter_role: { name } }) => (
                <Text data-cy="role">{name}</Text>
              ),
              'change role': ({ user: { id, name }, chapter_role }) => (
                <Button
                  data-cy="changeRole"
                  colorScheme="blue"
                  size="xs"
                  onClick={() =>
                    changeRole({
                      roleId: chapter_role.id,
                      userId: id,
                      userName: name,
                    })
                  }
                >
                  Change
                </Button>
              ),
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
