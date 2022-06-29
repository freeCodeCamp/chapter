import { prisma } from '../../../src/prisma';

// For the MVP we will not be using event roles to grant permissions, they're
// essentially placeholders.
const eventPermissions = [] as const;
type Permissions = typeof eventPermissions[number];

const eventRoles: { name: string; permissions: Permissions[] }[] = [
  { name: 'member', permissions: [] },
];

const createEventRoles = async () => {
  await prisma.event_permissions.createMany({
    data: eventPermissions.map((permission) => ({ name: permission })),
  });
  return (
    await Promise.all(
      eventRoles.map(
        async ({ name, permissions }) =>
          await prisma.event_roles.create({
            data: {
              name: name,
              event_role_permissions: {
                create: permissions.map((permission) => ({
                  event_permission: {
                    connect: {
                      name: permission,
                    },
                  },
                })),
              },
            },
          }),
      ),
    )
  )
    .map((role) => ({ [role.name]: { name: role.name, id: role.id } }))
    .reduce((acc, curr) => ({
      ...acc,
      ...curr,
    }));
};

export default createEventRoles;
