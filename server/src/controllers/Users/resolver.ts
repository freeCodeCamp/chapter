import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { UserWithInstanceRole } from '../../graphql-types';

@Resolver()
export class UsersResolver {
  @Authorized('view-users')
  @Query(() => [UserWithInstanceRole])
  async users(): Promise<UserWithInstanceRole[]> {
    return await prisma.users.findMany({
      orderBy: { first_name: 'asc' },
      include: {
        instance_role: {
          include: {
            instance_role_permissions: {
              include: { instance_permission: true },
            },
          },
        },
      },
    });
  }

  @Authorized('change-instance-role')
  @Mutation(() => UserWithInstanceRole)
  async changeInstanceUserRole(
    @Arg('roleId', () => Int) roleId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<UserWithInstanceRole> {
    return await prisma.users.update({
      data: { instance_role: { connect: { id: roleId } } },
      where: { id: userId },
      include: {
        instance_role: {
          include: {
            instance_role_permissions: {
              include: { instance_permission: true },
            },
          },
        },
      },
    });
  }
}
