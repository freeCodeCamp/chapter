import { Permission } from '../../../common/permissions';
import { User } from '../controllers/Auth/middleware';

export const isAdminingAll = (user: User) =>
  user.instance_role.instance_role_permissions.some(
    ({ instance_permission }) =>
      instance_permission.name === Permission.ChapterEdit,
  );

export const adminedFromChapterUsersWhere = (user_id: number) => ({
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
});
