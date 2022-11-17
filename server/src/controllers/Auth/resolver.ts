import { Resolver, Query, Ctx } from 'type-graphql';

import { ResolverCtx } from '../../common-types/gql';
import { UserWithInstanceRole } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserWithInstanceRole, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserWithInstanceRole | null> {
    return ctx.user ?? null;
  }
}
