import { prisma } from '../../../src/prisma';

import { ChapterPermission } from './chapterRoles.factory';

enum InstancePermission {
  ChapterCreate = 'chapter-create',
  ChangeInstanceRole = 'change-instance-role',
  ViewUsers = 'view-users',
}

// Ideally this would be a new enum, but TS does not (to my knowledge) support
// that yet.
export const Permission = { ...InstancePermission, ...ChapterPermission };
const allPermissions = Object.values(Permission);

interface InstanceRole {
  name: string;
  permissions: typeof allPermissions;
}

const roles: InstanceRole[] = [
  {
    name: 'owner',
    // the owners should be able to do everything
    permissions: allPermissions,
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
    data: allPermissions.map((permission) => ({ name: permission })),
  });
  const createdRoles = await Promise.all(roles.map(createRole));
  return createdRoles.reduce((acc, role) => ({
    ...acc,
    ...role,
  }));
};

export default createInstanceRoles;
