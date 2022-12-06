import {
  Button,
  Flex,
  Heading,
  VStack,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import React, { ReactElement, useState } from 'react';

import {
  useChangeInstanceUserRoleMutation,
  useInstanceRolesQuery,
  useUsersQuery,
} from '../../../../generated/graphql';

import UserName from '../../../../components/UserName';
import { Layout } from '../../shared/components/Layout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Users } from '../graphql/queries';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../shared/components/RoleChangeModal';
import { NextPageWithLayout } from '../../../../pages/_app';

export const UsersPage: NextPageWithLayout = () => {
  const { loading, error, data } = useUsersQuery();

  const { data: instanceRoles } = useInstanceRolesQuery();
  const modalProps = useDisclosure();
  const [instanceUser, setInstanceUser] = useState<RoleChangeModalData>();
  const [changeRoleMutation] = useChangeInstanceUserRoleMutation({
    refetchQueries: [{ query: Users }],
  });

  const changeRole = (data: RoleChangeModalData) => {
    setInstanceUser(data);
    modalProps.onOpen();
  };

  const onModalSubmit = (data: { newRoleName: string; userId: number }) => {
    changeRoleMutation({
      variables: {
        roleName: data.newRoleName,
        userId: data.userId,
      },
    });
    modalProps.onClose();
  };

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <>
      {instanceRoles && instanceUser && (
        <RoleChangeModal
          modalProps={modalProps}
          data={instanceUser}
          roles={instanceRoles.instanceRoles.map(({ id, name }) => ({
            id,
            name,
          }))}
          title="Change instance role"
          onSubmit={onModalSubmit}
        />
      )}
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Instance Users</Heading>
        </Flex>

        <Box display={{ base: 'none', lg: 'block' }} width={'100%'}>
          <DataTable
            data={data.users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'role', 'action'] as const}
            mapper={{
              name: (user) => <UserName user={user} />,
              action: ({ id, instance_role, name }) => (
                <Button
                  data-cy="changeRole"
                  background="gray.85"
                  color="gray.10"
                  _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
                  _focusVisible={{
                    outlineColor: 'blue.600',
                    outlineOffset: '1px',
                    boxShadow: 'none',
                  }}
                  size="xs"
                  onClick={() =>
                    changeRole({
                      roleName: instance_role.name,
                      userId: id,
                      userName: name,
                    })
                  }
                >
                  Change role
                </Button>
              ),
              role: ({ instance_role: { name } }) => (
                <Text data-cy="role">{name}</Text>
              ),
            }}
          />
        </Box>

        <Box display={{ base: 'block', lg: 'none' }}>
          {data.users.map(({ name, id, instance_role }, index) => (
            <DataTable
              key={id}
              data={[data.users[index]]}
              tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
              keys={['type', 'action'] as const}
              showHeader={false}
              mapper={{
                type: () => (
                  <VStack
                    fontWeight={'700'}
                    fontSize={['sm', 'md']}
                    align={'flex-start'}
                    marginBlock={'.5em'}
                  >
                    <Text>Name</Text>
                    <Text>Role</Text>
                    <Text>Action</Text>
                  </VStack>
                ),
                action: () => (
                  <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                    <UserName user={{ id, name }} />
                    <Text data-cy="role">{instance_role.name}</Text>
                    <Button
                      data-cy="changeRole"
                      background="gray.85"
                      color="gray.10"
                      _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
                      _focusVisible={{
                        outlineColor: 'blue.600',
                        outlineOffset: '1px',
                        boxShadow: 'none',
                      }}
                      size="xs"
                      onClick={() =>
                        changeRole({
                          roleName: instance_role.name,
                          userId: id,
                          userName: name,
                        })
                      }
                    >
                      Change role
                    </Button>
                  </VStack>
                ),
              }}
            />
          ))}
        </Box>
      </VStack>
    </>
  );
};

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
