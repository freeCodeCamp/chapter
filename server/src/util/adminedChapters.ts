import { Permission } from '../../../common/permissions';

interface User {
  instance_role: {
    instance_role_permissions: { instance_permission: { name: string } }[];
  };
}

export const isAdminFromInstanceRole = ({ instance_role }: User) =>
  instance_role.instance_role_permissions.some(
    ({ instance_permission }) =>
      instance_permission.name === Permission.ChapterEdit,
  );

export const isChapterAdminWhere = (user_id: number) => ({
  chapter_users: {
    some: {
      AND: [
        { user_id },
        {
          chapter_role: {
            chapter_role_permissions: {
              some: {
                chapter_permission: { name: Permission.ChapterEdit },
              },
            },
          },
        },
      ],
    },
  },
  user_bans: { none: { user_id } },
});
