import { Resolver, Query, Ctx } from 'type-graphql';

import { ResolverCtx } from '../../common-types/gql';
import { UserWithPermissionInfo } from '../../graphql-types';

@Resolver()
export class AuthResolver {
  @Query(() => UserWithPermissionInfo, { nullable: true })
  async me(@Ctx() ctx: ResolverCtx): Promise<UserWithPermissionInfo | null> {
    return ctx.user ?? null;
  }
}
