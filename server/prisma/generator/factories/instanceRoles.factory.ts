import { prisma } from '../../../src/prisma';

interface Role {
  name: string;
  permissions: string[];
}

const roles = [
  { name: 'administrator', permissions: ['chapter-create', 'chapter-edit'] },
  { name: 'member', permissions: [] },
];

const createRole = async ({ name, permissions }: Role) => {
  const permissionsData = permissions.map((permission) => ({
    instance_permission: {
      connectOrCreate: {
        create: { name: permission },
        where: { name: permission },
      },
    },
  }));
  const createdRole = await prisma.instance_roles.create({
    data: {
      name: name,
      instance_role_permissions: { create: permissionsData },
    },
  });
  return { [name]: { name: createdRole.name, id: createdRole.id } };
};

const createInstanceRoles = async () => {
  return Object.assign({}, ...(await Promise.all(roles.map(createRole))));
};

export default createInstanceRoles;
