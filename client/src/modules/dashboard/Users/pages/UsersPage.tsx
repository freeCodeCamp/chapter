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
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Users } from '../graphql/queries';
import {
  RoleChangeModal,
  RoleChangeModalData,
} from '../../shared/components/RoleChangeModal';
import { NextPageWithLayout } from '../../../../pages/_app';
import { Permission } from '../../../../../../common/permissions';
import { checkInstancePermission } from '../../../../util/check-permission';
import { useUser } from '../../../auth/user';

export const UsersPage: NextPageWithLayout = () => {
  const { loading, error, data } = useUsersQuery();
  const { user } = useUser();

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

  const hasPermissionToChangeRole = checkInstancePermission(
    user,
    Permission.ChapterUserRoleChange,
  );

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <>
      {hasPermissionToChangeRole && (
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
        </>
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
                <>
                  {hasPermissionToChangeRole && (
                    <Button
                      data-cy="changeRole"
                      colorScheme="blue"
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
                      <Text srOnly as="span">
                        for {name}
                      </Text>
                    </Button>
                  )}
                </>
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
                    {hasPermissionToChangeRole && <Text>Action</Text>}
                  </VStack>
                ),
                action: () => (
                  <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                    <UserName user={{ id, name }} />
                    <Text data-cy="role">{instance_role.name}</Text>
                    {hasPermissionToChangeRole && (
                      <Button
                        data-cy="changeRole"
                        colorScheme="blue"
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
                        <Text srOnly as="span">
                          for {name}
                        </Text>
                      </Button>
                    )}
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
  return <DashboardLayout>{page}</DashboardLayout>;
};
