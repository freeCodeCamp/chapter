import { prisma } from '../../../src/prisma';

const chapterPermissions = [
  'chapter-edit',
  'event-create',
  'event-edit',
] as const;

type Permissions = typeof chapterPermissions[number];

const roles: Array<{ name: string; permissions: Permissions[] }> = [
  {
    name: 'administrator',
    permissions: ['chapter-edit', 'event-create', 'event-edit'],
  },
  { name: 'organizer', permissions: ['event-create', 'event-edit'] },
  { name: 'moderator', permissions: ['event-edit'] },
  { name: 'member', permissions: [] },
];

const createChapterRoles = async () => {
  await prisma.chapter_permissions.createMany({
    data: chapterPermissions.map((permission) => ({ name: permission })),
  });
  return Object.assign(
    {},
    ...(
      await Promise.all(
        roles.map(
          async ({ name, permissions }) =>
            await prisma.chapter_roles.create({
              data: {
                name: name,
                chapter_role_permissions: {
                  create: permissions.map((permission) => ({
                    chapter_permission: {
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

export default createChapterRoles;
