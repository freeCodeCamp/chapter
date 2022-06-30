import { prisma } from '../../../src/prisma';

import { chapterPermissions } from './chapterRoles.factory';

const instancePermissions = [
  'chapter-create',
  'change-instance-role',
  'view-users',
  ...chapterPermissions,
] as const;

type Permissions = typeof instancePermissions[number];
interface InstanceRole {
  name: string;
  permissions: readonly Permissions[];
}

const roles: InstanceRole[] = [
  {
    name: 'owner',
    // the owners should be able to do everything
    permissions: instancePermissions,
  },
  { name: 'member', permissions: [] },
];

const createRole = async ({ name, permissions }: InstanceRole) => {
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
  return { [name]: { name: createdRole.name, id: createdRole.id } };
};

const createInstanceRoles = async () => {
  await prisma.instance_permissions.createMany({
    data: instancePermissions.map((permission) => ({ name: permission })),
  });
  const createdRoles = await Promise.all(roles.map(createRole));
  return createdRoles.reduce((acc, role) => ({
    ...acc,
    ...role,
  }));
};

export default createInstanceRoles;
