import { AuthChecker } from 'type-graphql';

import { ResolverCtx } from '../common-types/gql';
import { checker } from '../../../common/authorization';

function hasUserEventsAndVenues(
  ctx: ResolverCtx | Required<ResolverCtx>,
): ctx is Required<ResolverCtx> {
  return (
    typeof ctx.user !== 'undefined' &&
    typeof ctx.events !== 'undefined' &&
    typeof ctx.venues !== 'undefined'
  );
}

/** authorizationChecker allows or denies access to fields and resolvers based
 * on a user's role. It cannot affect what is returned by a resolver, it just
 * determines if the resolver is called or not. For fine-grained control, the
 * resolver itself must modify the response based on the user's roles */
export const authorizationChecker: AuthChecker<
  ResolverCtx | Required<ResolverCtx>
> = ({ context, info: { variableValues } }, requiredPermissions): boolean => {
  if (!hasUserEventsAndVenues(context)) return false;

  if (requiredPermissions.length !== 1) return false;
  const requiredPermission = requiredPermissions[0];

  return checker(context, requiredPermission, variableValues);
};
