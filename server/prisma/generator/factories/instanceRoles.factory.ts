import { prisma } from '../../../src/prisma';

const createInstanceRoles = async () => {
  const administrator = await prisma.instance_roles.create({
    data: {
      name: 'administrator',
      instance_role_permissions: {
        create: {
          instance_permission: {
            connectOrCreate: {
              create: {
                name: 'create chapter',
              },
              where: {
                name: 'create chapter',
              },
            },
          },
        },
      },
    },
  });

  const member = await prisma.instance_roles.create({
    data: {
      name: 'member',
    },
  });
  return {
    administrator: { name: administrator.name, id: administrator.id },
    member: { name: member.name, id: member.id },
  };
};

export default createInstanceRoles;
