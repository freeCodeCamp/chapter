import { prisma } from '../../../src/prisma';

import { InstancePermission, Permission } from '../../../../common/permissions';

const allPermissions = Object.values(Permission);

interface InstanceRole {
  name: 'owner' | 'chapter_administrator' | 'member';
  permissions: typeof allPermissions;
}

export type RoleMap = {
  [key in InstanceRole['name']]?: { name: string; id: number };
};

const memberPermissions = [
  InstancePermission.ChapterJoin,
  InstancePermission.ChapterSubscriptionManage,
];

const roles: InstanceRole[] = [
  {
    name: 'owner',
    // the owners should be able to do everything
    permissions: allPermissions,
  },
  {
    name: 'chapter_administrator',
    permissions: [...memberPermissions, InstancePermission.SponsorView],
  },
  {
    name: 'member',
    permissions: memberPermissions,
  },
];

const createRole = async ({
  name,
  permissions,
}: InstanceRole): Promise<RoleMap> => {
  const permissionsData = permissions.map((name) => ({
    instance_permission: {
      connect: { name },
    },
  }));
  const createdRole = await prisma.instance_roles.create({
    data: {
      name,
      instance_role_permissions: { create: permissionsData },
    },
  });
  const role: RoleMap = {};
  role[name] = createdRole;
  return role;
};

const createInstanceRoles = async (): Promise<Required<RoleMap>> => {
  await prisma.instance_permissions.createMany({
    data: allPermissions.map((permission) => ({ name: permission })),
  });
  const createdRoles = await Promise.all(roles.map(createRole));
  return createdRoles.reduce((acc, role) => ({
    ...acc,
    ...role,
  })) as Required<RoleMap>;
};

export default createInstanceRoles;
