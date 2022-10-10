import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';

import { UserWithInstanceRole } from '../../graphql-types';
import { Permission } from '../../../../common/permissions';
import { ChapterRoles } from '../../../prisma/generator/factories/chapterRoles.factory';
import { InstanceRoles } from '../../../prisma/generator/factories/instanceRoles.factory';

const instanceRoleInclude = {
  instance_role: {
    include: {
      instance_role_permissions: {
        include: { instance_permission: true },
      },
    },
  },
};

type UserWithUserChapters = Prisma.usersGetPayload<{
  include: {
    user_chapters: { include: { chapter_role: true } };
  };
}>;

interface ChangeRoleNameData {
  oldRole: string;
  newRole: string;
  user: UserWithUserChapters;
}

const getRoleName = ({ oldRole, newRole, user }: ChangeRoleNameData) => {
  if (
    oldRole === InstanceRoles.chapter_administrator &&
    newRole === InstanceRoles.member
  )
    return InstanceRoles.chapter_administrator;

  if (oldRole === InstanceRoles.owner) {
    const isAdmin = user.user_chapters.some(
      (chapter_user) =>
        chapter_user.chapter_role.name === ChapterRoles.administrator,
    );

    if (isAdmin) return InstanceRoles.chapter_administrator;
  }
  return newRole;
};

@Resolver()
export class UsersResolver {
  @Authorized(Permission.UsersView)
  @Query(() => [UserWithInstanceRole])
  async users(): Promise<UserWithInstanceRole[]> {
    const users = await prisma.users.findMany({
      orderBy: { name: 'asc' },
      include: instanceRoleInclude,
    });

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
  @Mutation(() => UserWithInstanceRole)
  async changeInstanceUserRole(
    @Arg('roleName', () => String) roleName: string,
    @Arg('userId', () => Int) userId: number,
  ): Promise<UserWithInstanceRole> {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id: userId },
      include: {
        ...instanceRoleInclude,
        user_chapters: { include: { chapter_role: true } },
      },
    });

    const oldRole = user.instance_role.name;
    const newRole = roleName;
    if (oldRole === newRole) return user;

    return await prisma.users.update({
      data: {
        instance_role: {
          connect: {
            name: getRoleName({ oldRole, newRole, user }),
          },
        },
      },
      where: { id: userId },
      include: instanceRoleInclude,
    });
  }
}
