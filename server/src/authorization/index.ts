import { GraphQLResolveInfo } from 'graphql';
import { AuthChecker } from 'type-graphql';

import { GQLCtx } from '../common-types/gql';
import { UserWithRoles } from '../graphql-types';

// This is a *very* broad type, but unfortunately variableValues is only
// constrained to be a Record<string, any>, basically.
type VariableValues = GraphQLResolveInfo['variableValues'];

/** authorizationChecker allows or denies access to fields and resolvers based
 * on a user's role. It cannot affect what is returned by a resolver, it just
 * determines if the resolver is called or not. For fine-grained control, the
 * resolver itself must modify the response based on the user's roles */
export const authorizationChecker: AuthChecker<GQLCtx> = async (
  { context: { user }, info: { variableValues } },
  requiredPermissions,
): Promise<boolean> => {
  validateVariableValues(variableValues);

  if (!user) return false;

  /** This defines our permission model. In short, a user's request will be
   * denied unless they have a role that grants them permission to use the
   * resolver that handles their request. That role can be instance wide,
   * specific to a single chapter or specific a single event within a chapter.
   *
   * Examples:
   *
   * If the user has permission 'UPDATE_EVENT' for the instance, they can update
   * all events.
   *
   * If the user has the permission 'UPDATE_EVENT' for chapter 1, they can
   * update all events in chapter 1.
   *
   * If the user only has the permission 'UPDATE_EVENT' for event 1, they can
   * only update event 1.
   * */

  if (await isAllowedByInstanceRole(user, requiredPermissions)) return true;
  if (await isAllowedByChapterRole(user, requiredPermissions, variableValues))
    return true;
  if (isAllowedByEventRole(user, requiredPermissions, variableValues))
    return true;

  return false;
};

function validateVariableValues(variableValues: VariableValues): void {
  // TODO: expand this as we extend Authorization.
  const allowedVariables = ['chapterId', 'eventId', 'userId'];

  Object.keys(variableValues).forEach((key) => {
    if (!allowedVariables.includes(key)) {
      throw new Error(`GraphQL id ${key} not allowed.
Accepted id names: ${allowedVariables.join(', ')}`);
    }
  });
}

async function isAllowedByChapterRole(
  user: UserWithRoles,
  requiredPermissions: string[],
  variableValues: VariableValues,
): Promise<boolean> {
  const chapterId = await getRelatedChapterId(user, variableValues);
  if (chapterId === null) return false;
  const userChapterPermissions = getUserPermissionsForChapter(user, chapterId);
  return hasNecessaryPermission(requiredPermissions, userChapterPermissions);
}

async function isAllowedByInstanceRole(
  user: UserWithRoles,
  requiredPermissions: string[],
): Promise<boolean> {
  const userInstancePermissions = getUserPermissionsForInstance(user);
  return hasNecessaryPermission(requiredPermissions, userInstancePermissions);
}

// a request may be associate with a specific chapter directly (if the request
// has a chapter id) or indirectly (if the request just has an event id).
async function getRelatedChapterId(
  user: UserWithRoles,
  variableValues: VariableValues,
): Promise<number | null> {
  const { chapterId, eventId } = variableValues;

  if (chapterId) return chapterId;

  if (eventId) {
    const userEvent = user.user_events.find(
      ({ event_id }) => event_id === eventId,
    );
    if (userEvent) return userEvent.event.chapter_id;
  }

  return null;
}

function isAllowedByEventRole(
  user: UserWithRoles,
  requiredPermissions: string[],
  info: VariableValues,
): boolean {
  const userEventPermissions = getUserPermissionsForEvent(user, info);
  return hasNecessaryPermission(requiredPermissions, userEventPermissions);
}

function getUserPermissionsForInstance(user: UserWithRoles): string[] {
  return user.instance_role.instance_role_permissions.map(
    (x) => x.instance_permission.name,
  );
}

function getUserPermissionsForChapter(
  user: UserWithRoles,
  chapterId: number,
): string[] {
  const role = user.user_chapters.find((role) => role.chapter_id === chapterId);
  return role
    ? role.chapter_role.chapter_role_permissions.map(
        (x) => x.chapter_permission.name,
      )
    : [];
}

function getUserPermissionsForEvent(
  user: UserWithRoles,
  variableValues: VariableValues,
): string[] {
  const role = user.user_events.find(
    ({ event_id }) => event_id === variableValues.eventId,
  );
  return role
    ? role.event_role.event_role_permissions.map((x) => x.event_permission.name)
    : [];
}

// TODO: do we need more than one permission per resolver? Probably not. A
// better approach might be to throw an error if we're given multiple
// permissions.
function hasNecessaryPermission(
  requiredPermissions: string[],
  ownedPermissions: string[],
): boolean {
  return requiredPermissions.some((allowed) =>
    ownedPermissions.includes(allowed),
  );
}
