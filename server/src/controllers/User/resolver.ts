import {
  FieldResolver,
  Resolver,
  Mutation,
  Ctx,
  Root,
  Arg,
} from 'type-graphql';
import { Prisma } from '@prisma/client';
import { User, Chapter, UserWithInstanceRole } from '../../graphql-types';
import { prisma } from '../../prisma';
import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';
import { UpdateUserInputs } from './input';

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

  @Mutation(() => User)
  async updateMe(
    @Ctx() ctx: Required<ResolverCtx>,
    @Arg('data') data: UpdateUserInputs,
  ): Promise<User | undefined> {
    const UserData: Prisma.usersUpdateInput = data;
    return await prisma.users.update({
      where: { id: ctx.user.id },
      data: UserData,
    });
  }

  @Mutation(() => User)
  async deleteMe(@Ctx() ctx: Required<ResolverCtx>): Promise<User | undefined> {
    return await prisma.users.delete({ where: { id: ctx.user.id } });
  }
}
