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
import { ResolverCtx } from '../../common-types/gql';
import {
  explicitlyAdminedWhere,
  isAdminFromInstanceRole,
} from '../../util/adminedChapters';
import { UpdateUserInputs } from './input';

@Resolver(() => UserWithInstanceRole)
export class UserWithInstanceRoleResolver {
  @FieldResolver(() => [Chapter])
  async admined_chapters(
    @Root() user: UserWithInstanceRole,
  ): Promise<Chapter[]> {
    return await prisma.chapters.findMany({
      ...(!isAdminFromInstanceRole(user) && {
        where: explicitlyAdminedWhere(user.id),
      }),
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
