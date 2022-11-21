import { ChapterRoles, InstanceRoles } from '../../common/roles';

import { isBannable } from '../src/util/chapterBans';

const baseArgs = {
  userId: 1,
  userChapterRole: ChapterRoles.member,
  userInstanceRole: InstanceRoles.member,
  otherChapterRole: ChapterRoles.member,
  otherInstanceRole: InstanceRoles.member,
  otherUserId: 2,
};

describe('chapterBans', () => {
  describe('isBannable', () => {
    describe('when user is instance owner', () => {
      it.each([
        {
          description: 'userId is otherUserId',
          testArgs: {
            ...baseArgs,
            userInstanceRole: InstanceRoles.owner,
            otherUserId: baseArgs.userId,
          },
          expected: false,
        },
        {
          description: 'other user is instance owner',
          testArgs: {
            ...baseArgs,
            userInstanceRole: InstanceRoles.owner,
            otherInstanceRole: InstanceRoles.owner,
          },
          expected: false,
        },
        {
          description: 'other user is chapter administrator',
          testArgs: {
            ...baseArgs,
            userInstanceRole: InstanceRoles.owner,
            otherChapterRole: ChapterRoles.administrator,
            otherInstanceRole: InstanceRoles.chapter_administrator,
          },
          expected: true,
        },
        {
          description: 'other user is chapter member',
          testArgs: {
            ...baseArgs,
            userInstanceRole: InstanceRoles.owner,
            otherChapterRole: ChapterRoles.member,
          },
          expected: true,
        },
      ])(
        'should return $expected when $description',
        ({ testArgs, expected }) => {
          expect(isBannable(testArgs)).toBe(expected);
        },
      );
    });

    describe('when user is chapter administrator', () => {
      it.each([
        {
          description: 'userId is otherUserId',
          testArgs: {
            ...baseArgs,
            userChapterRole: ChapterRoles.administrator,
            userInstanceRole: InstanceRoles.chapter_administrator,
            otherUserId: baseArgs.userId,
          },
          expected: false,
        },
        {
          description: 'other user is instance owner',
          testArgs: {
            ...baseArgs,
            userChapterRole: ChapterRoles.administrator,
            userInstanceRole: InstanceRoles.chapter_administrator,
            otherInstanceRole: InstanceRoles.owner,
          },
          expected: false,
        },
        {
          description: 'other user is chapter administrator',
          testArgs: {
            ...baseArgs,
            userChapterRole: ChapterRoles.administrator,
            userInstanceRole: InstanceRoles.chapter_administrator,
            otherChapterRole: ChapterRoles.administrator,
            otherInstanceRole: InstanceRoles.chapter_administrator,
          },
          expected: false,
        },
        {
          description: 'other user is chapter member',
          testArgs: {
            ...baseArgs,
            userChapterRole: ChapterRoles.administrator,
            userInstanceRole: InstanceRoles.chapter_administrator,
            otherChapterRole: ChapterRoles.member,
          },
          expected: true,
        },
      ])(
        'should return $expected when $description',
        ({ testArgs, expected }) => {
          expect(isBannable(testArgs)).toBe(expected);
        },
      );
    });

    describe('when user is chapter member', () => {
      it.each([
        {
          description: 'userId is otherUserId',
          testArgs: {
            ...baseArgs,
            otherUserId: baseArgs.userId,
          },
          expected: false,
        },
        {
          description: 'other user is instance owner',
          testArgs: {
            ...baseArgs,
            otherInstanceRole: InstanceRoles.owner,
          },
          expected: false,
        },
        {
          description: 'other user is chapter administrator',
          testArgs: {
            ...baseArgs,
            otherChapterRole: ChapterRoles.administrator,
            otherInstanceRole: InstanceRoles.chapter_administrator,
          },
          expected: false,
        },
        {
          description: 'other user is chapter member',
          testArgs: {
            ...baseArgs,
            otherChapterRole: ChapterRoles.member,
          },
          expected: false,
        },
      ])(
        'should return $expected when $description',
        ({ testArgs, expected }) => {
          expect(isBannable(testArgs)).toBe(expected);
        },
      );
    });
  });
});
