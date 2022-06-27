import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { merge } from 'lodash/fp';

import { authorizationChecker } from '../src/authorization';

import {
  userWithRoleForChapterOne,
  chapterTwoUserEvent,
  userWithRoleForEventOne,
  userWithInstanceRole,
  chapterOneUserEvent,
  userBansChapterOne,
  userBansChapterTwo,
} from './fixtures/users';

const mockReq = {} as Request;
const mockRes = {} as Response;
const mockInfo = { variableValues: {} } as GraphQLResolveInfo;

const baseResolverData = {
  context: { req: mockReq, res: mockRes },
  info: mockInfo,
  root: {},
  args: {},
};

describe('authorizationChecker', () => {
  describe('when user is NOT banned', () => {
    it('should return false if there is no user', () => {
      const result = authorizationChecker(baseResolverData, [
        'some-permission',
      ]);

      expect(result).toBe(false);
    });
    it('should return true if a user has an instance role granting permission', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithInstanceRole },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should return false if a user does not have an instance role granting permission', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithInstanceRole },
      });

      expect(
        authorizationChecker(resolverData, ['some-other-permission']),
      ).toBe(false);
    });

    it('should return true if a user has a chapter role granting permission', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should return false if a user only has a chapter role granting permission for another chapter', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithRoleForChapterOne },
        info: {
          variableValues: { chapterId: 2 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });

    it('should return true if a user has an event role granting permission', () => {
      const resolverData = merge(baseResolverData, {
        context: { user: userWithRoleForEventOne },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should return false if a user only has an event role granting permission for another event', () => {
      const eventTwoUserResolverData = merge(baseResolverData, {
        context: { user: userWithRoleForEventOne },
        info: {
          variableValues: { eventId: 2 },
        },
      });

      expect(
        authorizationChecker(eventTwoUserResolverData, ['some-permission']),
      ).toBe(false);
    });

    it('should return false if the event is in a chapter for which the user has no role', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_events: chapterTwoUserEvent,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
        info: { variableValues: { eventId: 2 } },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });

    it('should return true if a user has a chapter role, even if they do not have an event role', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_events: chapterOneUserEvent,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
        info: { variableValues: { eventId: 2 } },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });

    it('should return false unless the number of required permissions is 1', () => {
      expect.assertions(4);
      const resolverData = merge(baseResolverData, {
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
  });

  describe('when user is banned', () => {
    it('should return true if a user has an instance role and a chapter ban', () => {
      const user = merge(userWithInstanceRole, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });
    it('should return false if a user has a chapter role and a ban for that chapter', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });
    it('should return true if a user has a chapter role for one chapter, but is banned from a different one', () => {
      const user = merge(userWithRoleForChapterOne, {
        user_bans: userBansChapterTwo,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
        info: {
          variableValues: { chapterId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        true,
      );
    });
    it('should return false if a user has an event role and a ban for the owning chapter', () => {
      const user = merge(userWithRoleForEventOne, {
        user_bans: userBansChapterOne,
      });
      const resolverData = merge(baseResolverData, {
        context: { user },
        info: {
          variableValues: { eventId: 1 },
        },
      });

      expect(authorizationChecker(resolverData, ['some-permission'])).toBe(
        false,
      );
    });
    it('should return true if a user has an event role and a ban for another chapter', () => {
      const user = merge(userWithRoleForEventOne, {
        user_bans: userBansChapterTwo,
      });
      const resolverData = merge(baseResolverData, {
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
