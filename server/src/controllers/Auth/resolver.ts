import { Resolver, Query, Ctx } from 'type-graphql';

import { ResolverCtx } from '../../common-types/gql';
import { UserWithPermissions } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserWithPermissions, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserWithPermissions | null> {
    return ctx.user ?? null;
  }
}
