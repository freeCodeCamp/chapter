import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { merge } from 'lodash/fp';

import { authorizationChecker } from '../src/authorization';

import {
  chapterOneUser,
  chapterOneEventTwoUser,
  eventUser,
  instanceUser,
  chapterOneEventOneUser,
} from './fixtures/users';

const mockReq = {} as Request;
const mockRes = {} as Response;
const mockInfo = { variableValues: {} } as GraphQLResolveInfo;

const chapterOneVariableValues: GraphQLResolveInfo['variableValues'] = {
  chapterId: 1,
};
const mockChapterOneInfo = {
  variableValues: chapterOneVariableValues,
} as GraphQLResolveInfo;

const chapterTwoVariableValues: GraphQLResolveInfo['variableValues'] = {
  chapterId: 2,
};

const mockChapterTwoInfo = {
  variableValues: chapterTwoVariableValues,
} as GraphQLResolveInfo;

const eventOneVariableValues: GraphQLResolveInfo['variableValues'] = {
  eventId: 1,
};

const eventTwoVariableValues: GraphQLResolveInfo['variableValues'] = {
  eventId: 2,
};

const mockEventOneInfo = {
  variableValues: eventOneVariableValues,
} as GraphQLResolveInfo;

const mockEventTwoInfo = {
  variableValues: eventTwoVariableValues,
} as GraphQLResolveInfo;

const baseResolverData = {
  context: { req: mockReq, res: mockRes },
  info: mockInfo,
  root: {},
  args: {},
};

const instanceUserResolverData = merge(baseResolverData, {
  context: { user: instanceUser },
});

const chapterOneUserResolverData = merge(baseResolverData, {
  context: { user: chapterOneUser },
  info: mockChapterOneInfo,
});

const chapterTwoUserResolverData = merge(baseResolverData, {
  context: { user: chapterOneUser },
  info: mockChapterTwoInfo,
});

const eventUserResolverData = merge(baseResolverData, {
  context: { user: eventUser },
  info: mockEventOneInfo,
});

const eventTwoUserResolverData = merge(baseResolverData, {
  context: { user: eventUser },
  info: mockEventTwoInfo,
});

describe('authorizationChecker', () => {
  it('should return false if there is no user', async () => {
    const result = await authorizationChecker(baseResolverData, [
      'some-permission',
    ]);
    expect(result).toBe(false);
  });
  it('should return true if a user has an instance role granting permission', async () => {
    expect(
      await authorizationChecker(instanceUserResolverData, ['some-permission']),
    ).toBe(true);
  });

  it('should return false if a user does not have an instance role granting permission', async () => {
    expect(
      await authorizationChecker(instanceUserResolverData, [
        'some-other-permission',
      ]),
    ).toBe(false);
  });

  it('should return true if a user has a chapter role granting permission', async () => {
    expect(
      await authorizationChecker(chapterOneUserResolverData, [
        'some-permission',
      ]),
    ).toBe(true);
  });

  it('should return false if a user only has a chapter role granting permission for another chapter', async () => {
    expect(
      await authorizationChecker(chapterTwoUserResolverData, [
        'some-permission',
      ]),
    ).toBe(false);
  });

  it('should return true if a user has an event role granting permission', async () => {
    expect(
      await authorizationChecker(eventUserResolverData, ['some-permission']),
    ).toBe(true);
  });

  it('should return false if a user only has an event role granting permission for another event', async () => {
    expect(
      await authorizationChecker(eventTwoUserResolverData, ['some-permission']),
    ).toBe(false);
  });

  it('should return false if the event is in a chapter for which the user has no role', async () => {
    const chapterOneEventTwoUserResolverData = merge(baseResolverData, {
      context: { user: chapterOneEventTwoUser },
      info: { variableValues: { eventId: 2 } },
    });
    expect(
      await authorizationChecker(chapterOneEventTwoUserResolverData, [
        'some-permission',
      ]),
    ).toBe(false);
  });

  it('should return true if a user has a chapter role, even if they do not have an event role', async () => {
    const chapterOneEventOneResolverData = merge(baseResolverData, {
      context: { user: chapterOneEventOneUser },
      info: { variableValues: { eventId: 2 } },
    });
    expect(
      await authorizationChecker(chapterOneEventOneResolverData, [
        'some-permission',
      ]),
    ).toBe(true);
  });

  // TODO: might be best to just return false in production, rather than throw.
  it('should throw if it receives an invalid variableValue', async () => {
    const variableValues: GraphQLResolveInfo['variableValues'] = {
      chipterId: 1,
    };
    const info = { variableValues } as GraphQLResolveInfo;
    const userResolverData = merge(baseResolverData, {
      info,
    });

    await expect(
      authorizationChecker(userResolverData, ['some-permission']),
    ).rejects.toThrow(
      `GraphQL id chipterId not allowed.
Accepted id names: chapterId, eventId, userId`,
    );
  });
});
