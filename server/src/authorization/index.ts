import { GraphQLResolveInfo } from 'graphql';
import { AuthChecker } from 'type-graphql';

import { GQLCtx, Roles } from 'src/common-types/gql';
import { User } from 'src/graphql-types';
import { prisma } from 'src/prisma';

// This is a *very* broad type, but unfortunately variableValues is only
// constrained to be a Record<string, any>, basically.
type VariableValues = GraphQLResolveInfo['variableValues'];

/** authorizationChecker allows or denies access to fields and resolvers based
 * on a user's role. It cannot affect what is returned by a resolver, it just
 * determines if the resolver is called or not. For fine-grained control, the
 * resolver itself must modify the response based on the user's roles */
export const authorizationChecker: AuthChecker<GQLCtx> = async (
  { context: { user }, info: { variableValues } },
  permissions,
): Promise<boolean> => {
  validateVariableValues(variableValues);

  if (!user) return false;

  /** This defines our permission model. In short, a user is allowed to do
   * something if they have permission to do it. That permission can be instance
   * wide, specific to a single chapter or specific a single event within a
   * chapter.
   *
   * Those permissions are attached to roles, in that a given role has a set of
   * permissions (stored in a dedicated role_permissions table).
   *
   * Examples:
   *
   * If the user has permission 'UPDATE_EVENT' for the instance, they can update
   * all events.
   *
   * If the user has the permission 'UPDATE_EVENT' for chapter 1, they can
   * update all events in that chapter 1.
   *
   * If the user has  the permission 'UPDATE_EVENT' for event 1, they can
   * update event 1.
   * */

  // if (isAllowedByInstanceRole(user, roles, info)) return true;
  if (await isAllowedByChapterRole(user, permissions, variableValues))
    return true;
  if (isAllowedByEventRole(user, permissions, variableValues)) return true;

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
  user: User & Roles,
  roles: string[],
  variableValues: VariableValues,
): Promise<boolean> {
  const chapterId = await getRelatedChapterId(variableValues);
  if (chapterId === null) return false;
  const chapterPermissions = getChapterPermissionsById(user, chapterId);
  return hasNecessaryPermission(roles, chapterPermissions);
}

async function getRelatedChapterId(
  variableValues: VariableValues,
): Promise<number | null> {
  const { chapterId, eventId } = variableValues;

  if (chapterId) return chapterId;

  if (eventId) {
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      select: { chapter_id: true },
    });
    if (event) return event.chapter_id;
  }

  // TODO: any other cases *must* be resolved via findUnique, or we risk someone
  // getting access to a chapter they shouldn't.

  return null;
}

function isAllowedByEventRole(
  user: User & Roles,
  permissions: string[],
  info: VariableValues,
): boolean {
  const eventPermissions = getEventPermissions(user, info);
  return hasNecessaryPermission(permissions, eventPermissions);
}

function getChapterPermissionsById(
  user: User & Roles,
  chapterId: number,
): string[] {
  const role = user.chapter_roles.find((role) => role.chapter_id === chapterId);
  return role ? [role.role_name] : [];
}

// TODO: this is pretending there are multiple roles, but for now there's only
// one. For this to change, we need to extend the db to support multiple roles
// for each role type. (i.e. an 'organizer' would have things like
// 'UPDATE_EVENT', 'CONFIRM_RSVP' etc.)
function getEventPermissions(
  user: User & Roles,
  variableValues: VariableValues,
): string[] {
  const role = user.user_event_roles.find(
    ({ event_id }) => event_id === variableValues.eventId,
  );
  return role ? [role.role_name] : [];
}

// TODO: do we need more than one permission per resolver? Probably not. A
// better approach might be to throw an error if we're given multiple
// permissions.
function hasNecessaryPermission(
  allowedPermissions: string[],
  roles: string[],
): boolean {
  return allowedPermissions.some((allowed) => roles.includes(allowed));
}
