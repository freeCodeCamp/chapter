import { prisma } from '../../../src/prisma';

const instancePermissions = [
  'chapter-create',
  'chapter-edit',
  'change-instance-role',
  'view-users',
  'rsvp',
] as const;
type Permissions = typeof instancePermissions[number];
interface InstanceRole {
  name: string;
  permissions: Permissions[];
}

const roles: InstanceRole[] = [
  {
    name: 'owner',
    permissions: [
      'chapter-create',
      'chapter-edit',
      'change-instance-role',
      'view-users',
      'rsvp',
    ],
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
