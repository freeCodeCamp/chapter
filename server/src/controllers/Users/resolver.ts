import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { UserWithInstanceRole } from '../../graphql-types';
import { Permission } from '../../../../common/permissions';
import { InstanceRoles } from '../../../../common/roles';
import { getRoleName } from '../../util/chapterAdministrator';
import mailerService from '../../../src/services/MailerService';
import { instanceUserRoleChange } from '../../email-templates';

const instanceRoleInclude = {
  instance_role: {
    include: {
      instance_role_permissions: {
        include: { instance_permission: true },
      },
    },
  },
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
  @Mutation(() => UserWithInstanceRole)
  async changeInstanceUserRole(
    @Arg('roleName', () => String) newRole: string,
    @Arg('id', () => Int) id: number,
  ): Promise<UserWithInstanceRole> {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id },
      include: {
        ...instanceRoleInclude,
        user_chapters: { include: { chapter_role: true } },
      },
    });

    const oldRole = user.instance_role.name;
    if (oldRole === newRole) return user;

    const { subject, emailText } = instanceUserRoleChange({
      name: user.name,
      newRole,
    });

    await mailerService.sendEmail({
      emailList: [user.email],
      subject,
      htmlEmail: emailText,
    });

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
