import {
  FieldResolver,
  Resolver,
  Mutation,
  Ctx,
  Root,
  Arg,
  Query,
} from 'type-graphql';
import { Prisma } from '@prisma/client';
import {
  User,
  Chapter,
  UserWithPermissions,
  UserInformation,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import { ResolverCtx } from '../../common-types/gql';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { UpdateUserInputs } from './input';

@Resolver(() => UserWithPermissions)
export class UserWithPermissionsResolver {
  @FieldResolver(() => [Chapter])
  async admined_chapters(
    @Root() user: UserWithPermissions,
  ): Promise<Chapter[]> {
    return await prisma.chapters.findMany({
      ...(!isAdminFromInstanceRole(user) && {
        where: isChapterAdminWhere(user.id),
      }),
    });
  }

  @Query(() => UserInformation, { nullable: true })
  async userInformation(
    @Ctx() ctx: ResolverCtx,
  ): Promise<UserInformation | null> {
    if (!ctx.user) return null;
    return await prisma.users.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        user_chapters: {
          include: {
            chapter_role: {
              include: {
                chapter_role_permissions: {
                  include: { chapter_permission: true },
                },
              },
            },
            chapter: true,
          },
        },
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

  @Mutation(() => User)
  async toggleAutoSubscribe(@Ctx() ctx: Required<ResolverCtx>): Promise<User> {
    return await prisma.users.update({
      data: { auto_subscribe: !ctx.user.auto_subscribe },
      where: { id: ctx.user.id },
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
