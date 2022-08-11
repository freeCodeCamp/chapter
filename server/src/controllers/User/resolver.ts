import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Chapter, UserWithInstanceRole } from '../../graphql-types';
import { prisma } from '../../prisma';

import { Permission } from '../../../../common/permissions';

@Resolver(() => UserWithInstanceRole)
export class UserWithInstanceRoleResolver {
  @FieldResolver(() => [Chapter])
  async admined_chapters(
    @Root() user: UserWithInstanceRole,
  ): Promise<Chapter[]> {
    if (
      user.instance_role.instance_role_permissions.some(
        ({ instance_permission }) =>
          instance_permission.name === Permission.ChapterEdit,
      )
    ) {
      return await prisma.chapters.findMany();
    }
    return await prisma.chapters.findMany({
      where: {
        chapter_users: {
          some: {
            AND: [
              { user_id: user.id },
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
      },
    });
  }
}
