import { Resolver, Query, Mutation, Ctx, Int, Arg } from 'type-graphql';
import { prisma } from '../../prisma';

import { ResolverCtx } from '../../common-types/gql';
import { UserWithInstanceRole } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserWithInstanceRole, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserWithInstanceRole | null> {
    return ctx.user ?? null;
  }

  @Mutation(() => UserWithInstanceRole)
  async deleteMe(
    @Arg('id', () => Int) id: number,
  ): Promise<UserWithInstanceRole> {
    return await prisma.users.delete({ where: { id } });
  }
}
