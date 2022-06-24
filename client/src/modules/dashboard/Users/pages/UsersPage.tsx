import {
  Button,
  Flex,
  Heading,
  VStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import React, { useState } from 'react';

import {
  useChangeInstanceUserRoleMutation,
  useInstanceRolesQuery,
  useUsersQuery,
} from '../../../../generated/graphql';

import { Layout } from '../../shared/components/Layout';
import { Users } from '../graphql/queries';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from 'modules/dashboard/shared/components/RoleChangeModal';

export const UsersPage: NextPage = () => {
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

  const onModalSubmit = async (data: { newRoleId: number; userId: number }) => {
    changeRoleMutation({
      variables: {
        roleId: data.newRoleId,
        userId: data.userId,
      },
    });
    modalProps.onClose();
  };

  return (
    <Layout>
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
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.users ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={data.users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'role', 'ops'] as const}
            mapper={{
              name: ({ name }) => <Text data-cy="name">{name}</Text>,
              ops: ({ id, instance_role, name }) => (
                <Button
                  data-cy="changeRole"
                  colorScheme="blue"
                  size="xs"
                  onClick={() =>
                    changeRole({
                      roleId: instance_role.id,
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
        )}
      </VStack>
    </Layout>
  );
};
