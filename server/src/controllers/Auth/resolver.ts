import { Resolver, Query, Mutation, Ctx, Int, Arg } from 'type-graphql';
import { prisma } from '../../prisma';

import { ResolverCtx } from '../../common-types/gql';
import { User, UserWithInstanceRole } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserWithInstanceRole, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserWithInstanceRole | null> {
    return ctx.user ?? null;
  }

  @Mutation(() => User)
  async deleteMe(@Arg('id', () => Int) id: number): Promise<User> {
    return await prisma.users.delete({ where: { id } });
  }
}
