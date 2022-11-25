import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { merge } from 'lodash/fp';

import { authorizationChecker } from '../src/authorization';

import {
  userWithRoleForChapterOne,
  userWithRoleForChaptersOneAndTwo,
  chapterTwoEventUser,
  userWithRoleForEventOne,
  userWithInstanceRole,
  userBansChapterOne,
  userBansChapterTwo,
} from './fixtures/users';

import { events } from './fixtures/events';
import { venues } from './fixtures/venues';

const mockReq = {} as Request;
const mockRes = {} as Response;
const mockInfo = { variableValues: {} } as GraphQLResolveInfo;

const baseResolverData = {
  context: {
    req: mockReq,
    res: mockRes,
    user: undefined,
    events: undefined,
    venues: undefined,
  },
  info: mockInfo,
  root: {},
  args: {},
};

const resolverDataWithEventsAndVenues = merge(baseResolverData, {
  context: { events, venues },
});

describe('authorizationChecker', () => {
  describe('when user is NOT banned', () => {
    it('should reject if user is undefined', () => {
      const result = authorizationChecker(resolverDataWithEventsAndVenues, [
        'some-permission',
      ]);

      expect(result).toBe(false);
    });

    it('should reject if user is defined, but events or venue is not', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithInstanceRole },
      });
      const resolverDataWithEvents = merge(resolverData, {
        context: { events },
      });
      const resolverDataWithVenues = merge(resolverData, {
        context: { venues },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
      expect(
        authorizationChecker(resolverDataWithEvents, ['some-permission']),
      ).toBe(false);
      expect(
        authorizationChecker(resolverDataWithVenues, ['some-permission']),
      ).toBe(false);
    });

    it('should authorize if the events and venues properties exist, but are empty arrays', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithInstanceRole, events: [], venues: [] },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should authorize if a user has an instance role granting permission', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithInstanceRole },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should reject if a user does not have an instance role granting permission', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithInstanceRole },
      });

      expect(
        authorizationChecker(resolverData, ['some-other-permission']),
      ).toBe(false);
    });

    it('should authorize if a user has a chapter role granting permission', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should authorize if a user has a chapter role granting permission and the chapter is inferred from the event', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should authorize if a user has a chapter role granting permission and the chapter is inferred from the venue', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { venueId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should reject if a user has a role for a chapter but a different chapter is inferred', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForChapterOne },
        info: {
          // event 3 is chapter 2
          variableValues: { eventId: 3 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });

    it('should reject if a user only has a chapter role granting permission for another chapter', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { chapterId: 2 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });

    it('should authorize if a user has an event role granting permission', () => {
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForEventOne },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should reject if a user only has an event role granting permission for another event', () => {
      const eventTwoUserResolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithRoleForEventOne },
        info: {
          variableValues: { eventId: 2 },
        },
      });

      expect(
        authorizationChecker(eventTwoUserResolverData, ['some-permission']),
      ).toBe(false);
    });

    it('should reject if the event is in a chapter for which the user has no role', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_events: chapterTwoEventUser,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // event 4 is in chapter 3
        info: { variableValues: { eventId: 4 } },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });

    it('should authorize if a user has a chapter role, even if they do not have an event role', () => {
      const user = userWithRoleForChapterOne;
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // event 2 is in chapter 1
        info: { variableValues: { eventId: 2 } },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should reject unless the number of required permissions is 1', () => {
      expect.assertions(4);
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user: userWithInstanceRole },
      });

      expect(authorizationChecker(resolverData, [])).toBe(false);
      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
      expect(
        authorizationChecker(resolverData, ['a-different-permission']),
      ).toBe(true);
      expect(
        authorizationChecker(resolverData, [
          'some-permission',
          'a-different-permission',
        ]),
      ).toBe(false);
    });

    it('should reject requests when the chapterId inferred from eventId does not match the provided chapterId', () => {
      expect.assertions(1);
      const user = userWithRoleForChaptersOneAndTwo;

      const eventIdChapterIdMismatch = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // Event 2 is in chapter 1, but the request should fail even though the
        // user has the required permission for chapter 1 since they're claiming
        // it is for chapter 2.
        info: { variableValues: { eventId: 2, chapterId: 2 } },
      });

      expect(
        authorizationChecker(eventIdChapterIdMismatch, ['some-permission']),
      ).toBe(false);
    });

    it('should reject requests when the chapterId inferred from venue does not match the provided chapterId', () => {
      expect.assertions(1);
      const user = userWithRoleForChaptersOneAndTwo;
      const venueIdChapterIdMismatch = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // Venue 2 is in chapter 1
        info: { variableValues: { venueId: 2, chapterId: 2 } },
      });

      expect(
        authorizationChecker(venueIdChapterIdMismatch, ['some-permission']),
      ).toBe(false);
    });
    it('should reject requests when the chapterId inferred from eventId does not match the id inferred from venueId', () => {
      expect.assertions(1);
      const user = userWithRoleForChaptersOneAndTwo;

      const eventIdVenueIdMismatch = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // Event 2 is in chapter 1, but venueId 3 is in chapter 2.
        info: { variableValues: { eventId: 2, venueId: 3 } },
      });

      expect(
        authorizationChecker(eventIdVenueIdMismatch, ['some-permission']),
      ).toBe(false);
    });

    it("should reject event requests if the admin is not a member of that event's chapter", () => {
      expect.assertions(1);
      const user = userWithRoleForChaptersOneAndTwo;

      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        // Event 10000 does not appear in the admin's event list (i.e. it's in a
        // chapter they're not a member of)
        info: { variableValues: { eventId: 10000 } },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });
  });

  describe('when user is banned', () => {
    it('should authorize if a user has an instance role and a chapter ban', () => {
      const user = merge(userWithInstanceRole, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });
    it('should reject if a user has a chapter role and a ban for that chapter', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });
    it('should authorize if a user has a chapter role for one chapter, but is banned from a different one', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_bans: userBansChapterTwo,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });
    it('should reject if a user has an event role and a ban for the owning chapter', () => {
      const user = merge(userWithRoleForEventOne, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });
    it('should authorize if a user has an event role and a ban for another chapter', () => {
      const user = merge(userWithRoleForEventOne, {
        user_bans: userBansChapterTwo,
      });
      const resolverData = merge(resolverDataWithEventsAndVenues, {
        context: { user },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });
  });
});
