import { GraphQLResolveInfo } from 'graphql';
import { AuthChecker } from 'type-graphql';

import { GQLCtx } from '../common-types/gql';
import type { Events, User } from '../controllers/Auth/middleware';

// This is a *very* broad type, but unfortunately variableValues is only
// constrained to be a Record<string, any>, basically.
type VariableValues = GraphQLResolveInfo['variableValues'];

/** authorizationChecker allows or denies access to fields and resolvers based
 * on a user's role. It cannot affect what is returned by a resolver, it just
 * determines if the resolver is called or not. For fine-grained control, the
 * resolver itself must modify the response based on the user's roles */
export const authorizationChecker: AuthChecker<GQLCtx | Required<GQLCtx>> = (
  { context, info: { variableValues } },
  requiredPermissions,
): boolean => {
  if (!hasUser(context)) return false;

  if (requiredPermissions.length !== 1) return false;
  const requiredPermission = requiredPermissions[0];

  if (isAllowedByInstanceRole(context, requiredPermission)) return true;
  if (isBannedFromChapter(context, variableValues)) return false;
  if (isAllowedByChapterRole(context, requiredPermission, variableValues))
    return true;
  if (isAllowedByEventRole(context, requiredPermission, variableValues))
    return true;

  return false;
};

function hasUser(ctx: GQLCtx | Required<GQLCtx>): ctx is Required<GQLCtx> {
  return 'user' in ctx;
}

function isAllowedByChapterRole(
  { user, events }: Required<GQLCtx>,
  requiredPermission: string,
  variableValues: VariableValues,
): boolean {
  const chapterId = getRelatedChapterId(events, variableValues);
  if (chapterId === null) return false;
  const userChapterPermissions = getUserPermissionsForChapter(user, chapterId);
  return hasNecessaryPermission(requiredPermission, userChapterPermissions);
}

function isAllowedByInstanceRole(
  { user }: Required<GQLCtx>,
  requiredPermission: string,
): boolean {
  const userInstancePermissions = getUserPermissionsForInstance(user);
  return hasNecessaryPermission(requiredPermission, userInstancePermissions);
}

// a request may be associate with a specific chapter directly (if the request
// has a chapter id) or indirectly (if the request just has an event id).
function getRelatedChapterId(
  events: Events,
  variableValues: VariableValues,
): number | null {
  const { chapterId, eventId } = variableValues;

  if (chapterId) return chapterId;

  if (eventId) {
    const event = events.find(({ id }) => id === eventId);
    if (event) return event.chapter_id;
  }

  return null;
}

function isAllowedByEventRole(
  { user }: Required<GQLCtx>,
  requiredPermission: string,
  info: VariableValues,
): boolean {
  const userEventPermissions = getUserPermissionsForEvent(user, info);
  return hasNecessaryPermission(requiredPermission, userEventPermissions);
}

function getUserPermissionsForInstance(user: User): string[] {
  return user.instance_role.instance_role_permissions.map(
    (x) => x.instance_permission.name,
  );
}

function getUserPermissionsForChapter(user: User, chapterId: number): string[] {
  const role = user.user_chapters.find((role) => role.chapter_id === chapterId);
  return role
    ? role.chapter_role.chapter_role_permissions.map(
        (x) => x.chapter_permission.name,
      )
    : [];
}

function getUserPermissionsForEvent(
  user: User,
  variableValues: VariableValues,
): string[] {
  const role = user.user_events.find(
    ({ event_id }) => event_id === variableValues.eventId,
  );
  return role
    ? role.event_role.event_role_permissions.map((x) => x.event_permission.name)
    : [];
}

function isBannedFromChapter(
  { user, events }: Required<GQLCtx>,
  variableValues: VariableValues,
): boolean {
  const chapterId = getRelatedChapterId(events, variableValues);
  if (chapterId === null) return false;

  const bannedFromChapter = user.user_bans?.some(
    (ban) => ban.chapter_id === chapterId,
  );

  return bannedFromChapter;
}

function hasNecessaryPermission(
  requiredPermission: string,
  ownedPermissions: string[],
): boolean {
  return ownedPermissions.includes(requiredPermission);
}
