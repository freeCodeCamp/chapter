import { GraphQLResolveInfo } from 'graphql';
import { AuthChecker } from 'type-graphql';

import { ResolverCtx } from '../server/src/common-types/gql';
import type { Events, Venues } from '../server/src/controllers/Auth/middleware';
import { ChapterPermission, InstancePermission } from './permissions';

// This is a *very* broad type, but unfortunately variableValues is only
// constrained to be a Record<string, any>, basically.
type VariableValues = GraphQLResolveInfo['variableValues'];

interface UserWithRelations {
  instance_role: {
    instance_role_permissions: {
      instance_permission: {
        name: string;
      };
    }[];
  };
  user_bans: {
    chapter_id: number;
  }[];
  user_chapters: {
    chapter_id: number;
    chapter_role: {
      chapter_role_permissions: {
        chapter_permission: {
          name: string;
        };
      }[];
    };
  }[];
  user_events: {
    event_id: number;
    event_role: {
      event_role_permissions: {
        event_permission: {
          name: string;
        };
      }[];
    };
  }[];
}

interface ContextData {
  user: UserWithRelations;
  events: Events;
  venues: Venues;
}

function hasUserEventsAndVenues(
  ctx: ResolverCtx | Required<ResolverCtx>,
): ctx is Required<ResolverCtx> {
  return (
    typeof ctx.user !== 'undefined' &&
    typeof ctx.events !== 'undefined' &&
    typeof ctx.venues !== 'undefined'
  );
}

function hasNecessaryPermission(
  requiredPermission: string,
  ownedPermissions: string[],
): boolean {
  return ownedPermissions.includes(requiredPermission);
}

function getUserPermissionsForChapter(
  user: UserWithRelations,
  chapterId: number,
): string[] {
  const role = user.user_chapters.find((role) => role.chapter_id === chapterId);
  return role
    ? role.chapter_role.chapter_role_permissions.map(
        (x) => x.chapter_permission.name,
      )
    : [];
}

// a request may be associate with a specific chapter directly (if the request
// has a chapter id) or indirectly (if the request just has an event id).
function getRelatedChapterId(
  { events, venues }: { events: Events; venues: Venues },
  variableValues: VariableValues,
): number | null {
  const { chapterId, eventId, venueId } = variableValues;

  if (chapterId) return chapterId;

  if (eventId) {
    const event = events.find(({ id }) => id === eventId);
    if (event) return event.chapter_id;
  }

  if (venueId) {
    const venue = venues.find(({ id }) => id === venueId);
    if (venue) return venue.chapter_id;
  }

  return null;
}

function isAllowedByChapterRole(
  { user, events, venues }: ContextData,
  requiredPermission: string,
  variableValues: VariableValues,
): boolean {
  const chapterId = getRelatedChapterId({ events, venues }, variableValues);
  if (chapterId === null) return false;
  const userChapterPermissions = getUserPermissionsForChapter(user, chapterId);
  return hasNecessaryPermission(requiredPermission, userChapterPermissions);
}

function getUserPermissionsForInstance(user: UserWithRelations): string[] {
  return user.instance_role.instance_role_permissions.map(
    (x) => x.instance_permission.name,
  );
}

function isAllowedByInstanceRole(
  { user }: ContextData,
  requiredPermission: string,
): boolean {
  const userInstancePermissions = getUserPermissionsForInstance(user);
  return hasNecessaryPermission(requiredPermission, userInstancePermissions);
}

function getUserPermissionsForEvent(
  user: UserWithRelations,
  variableValues: VariableValues,
): string[] {
  const role = user.user_events.find(
    ({ event_id }) => event_id === variableValues.eventId,
  );
  return role
    ? role.event_role.event_role_permissions.map((x) => x.event_permission.name)
    : [];
}

function isAllowedByEventRole(
  { user }: ContextData,
  requiredPermission: string,
  info: VariableValues,
): boolean {
  const userEventPermissions = getUserPermissionsForEvent(user, info);
  return hasNecessaryPermission(requiredPermission, userEventPermissions);
}

function isBannedFromChapter(
  { user, events, venues }: ContextData,
  variableValues: VariableValues,
): boolean {
  const chapterId = getRelatedChapterId({ events, venues }, variableValues);
  if (chapterId === null) return false;

  const bannedFromChapter = user.user_bans?.some(
    (ban) => ban.chapter_id === chapterId,
  );

  return bannedFromChapter;
}

function checker(
  context: ContextData,
  requiredPermission: string,
  variableValues: VariableValues,
) {
  if (isAllowedByInstanceRole(context, requiredPermission)) return true;
  if (isBannedFromChapter(context, variableValues)) return false;
  if (isAllowedByChapterRole(context, requiredPermission, variableValues))
    return true;
  if (isAllowedByEventRole(context, requiredPermission, variableValues))
    return true;

  return false;
}

export const checkPermission = (
  user: UserWithRelations | null | undefined,
  requiredPermission: InstancePermission | ChapterPermission,
  variableValues?: VariableValues,
) => {
  if (!user) return false;
  const context = { user, events: [], venues: [] };
  return checker(context, requiredPermission, variableValues || {});
};

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
