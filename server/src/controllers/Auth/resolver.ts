import { Resolver, Query, Ctx } from 'type-graphql';

import { ResolverCtx } from '../../common-types/gql';
import { UserProfile } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserProfile, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserProfile | null> {
    return ctx.user ?? null;
  }
}
