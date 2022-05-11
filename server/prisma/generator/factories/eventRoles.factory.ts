import { prisma } from '../../../src/prisma';

const eventPermissions = [
  'event-cancel',
  'event-edit',
  'send-invites',
] as const;
type Permissions = typeof eventPermissions[number];

const eventRoles: { name: string; permissions: Permissions[] }[] = [
  {
    name: 'organizer',
    permissions: ['event-cancel', 'event-edit', 'send-invites'],
  },
  { name: 'staff', permissions: ['send-invites'] },
  { name: 'attendee', permissions: [] },
];

const createEventRoles = async () => {
  await prisma.event_permissions.createMany({
    data: eventPermissions.map((permission) => ({ name: permission })),
  });
  return Object.assign(
    {},
    ...(
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
    ).map((role) => ({ [role.name]: { name: role.name, id: role.id } })),
  );
};

export default createEventRoles;
