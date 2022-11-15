import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { UserWithPermissions } from '../../graphql-types';
import { Permission } from '../../../../common/permissions';
import { InstanceRoles } from '../../../prisma/init/factories/instanceRoles.factory';
import { getRoleName } from '../../util/chapterAdministrator';

const instanceRoleInclude = {
  instance_role: {
    include: {
      instance_role_permissions: {
        include: { instance_permission: true },
      },
    },
  },
  user_chapters: {
    include: {
      chapter_role: {
        include: {
          chapter_role_permissions: { include: { chapter_permission: true } },
        },
      },
    },
  },
  user_bans: true,
};

@Resolver()
export class UsersResolver {
  @Authorized(Permission.UsersView)
  @Query(() => [UserWithPermissions])
  async users(): Promise<UserWithPermissions[]> {
    const users = await prisma.users.findMany({
      orderBy: { name: 'asc' },
      include: instanceRoleInclude,
    });

    // The chapter_administrator role is internal, so should not be displayed
    const usersWithReplacedAdministrator = users.map((user) => {
      if (user.instance_role.name !== InstanceRoles.chapter_administrator) {
        return user;
      }
      const userWithReplacedRoleName = { ...user };
      userWithReplacedRoleName.instance_role.name = InstanceRoles.member;
      return userWithReplacedRoleName;
    });
    return usersWithReplacedAdministrator;
  }

  @Authorized(Permission.UserInstanceRoleChange)
  @Mutation(() => UserWithPermissions)
  async changeInstanceUserRole(
    @Arg('roleName', () => String) newRole: string,
    @Arg('id', () => Int) id: number,
  ): Promise<UserWithPermissions> {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id },
      include: instanceRoleInclude,
    });

    const oldRole = user.instance_role.name;
    if (oldRole === newRole) return user;

    return await prisma.users.update({
      data: {
        instance_role: {
          connect: {
            name: getRoleName({
              oldRole,
              newRole,
              userChapters: user.user_chapters,
            }),
          },
        },
      },
      where: { id },
      include: instanceRoleInclude,
    });
  }
}
