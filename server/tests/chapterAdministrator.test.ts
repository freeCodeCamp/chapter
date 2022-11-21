import { ChapterRoles, InstanceRoles } from '../../common/roles';
import {
  getInstanceRoleName,
  getRoleName,
} from '../src/util/chapterAdministrator';
import {
  userChaptersWithChapter1Admin,
  userChaptersWithChapter2Admin,
  userChaptersWithTwoAdmins,
  userChaptersWithTwoMembers,
} from './fixtures/chapterUsers';

describe('chapterAdministrator', () => {
  describe('getInstanceRoleName', () => {
    describe('for instance owner', () => {
      describe('for admin of 1 chapter', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithChapter1Admin,
            expected: InstanceRoles.owner,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithChapter1Admin,
            expected: InstanceRoles.owner,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.owner,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });
      describe('for admin of 2 chapter', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithChapter2Admin,
            expected: InstanceRoles.owner,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithChapter2Admin,
            expected: InstanceRoles.owner,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.owner,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });

      describe('for admin of chapters', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithTwoAdmins,
            expected: InstanceRoles.owner,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithTwoAdmins,
            expected: InstanceRoles.owner,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.owner,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });

      describe('for member of chapters', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithTwoMembers,
            expected: InstanceRoles.owner,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithTwoMembers,
            expected: InstanceRoles.owner,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.owner,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });
    });

    describe('for instance chapter_administrator', () => {
      describe('for admin of 1 chapter', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithChapter1Admin,
            expected: InstanceRoles.member,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithChapter1Admin,
            expected: InstanceRoles.chapter_administrator,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.chapter_administrator,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });

      describe('for admin of 2 chapter', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithChapter2Admin,
            expected: InstanceRoles.chapter_administrator,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithChapter2Admin,
            expected: InstanceRoles.chapter_administrator,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.chapter_administrator,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });

      describe('for admin of chapters', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithTwoAdmins,
            expected: InstanceRoles.chapter_administrator,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithTwoAdmins,
            expected: InstanceRoles.chapter_administrator,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.chapter_administrator,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });
    });

    describe('for instance member', () => {
      describe('for member of chapters', () => {
        it.each([
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.member,
            userChapters: userChaptersWithTwoMembers,
            expected: InstanceRoles.member,
          },
          {
            changedChapterId: 1,
            newChapterRole: ChapterRoles.administrator,
            userChapters: userChaptersWithTwoMembers,
            expected: InstanceRoles.chapter_administrator,
          },
        ])(
          'should return $expected when changing to chapter $changedChapterId $newChapterRole',
          ({ changedChapterId, newChapterRole, userChapters, expected }) => {
            expect(
              getInstanceRoleName({
                changedChapterId,
                newChapterRole,
                oldInstanceRole: InstanceRoles.member,
                userChapters,
              }),
            ).toBe(expected);
          },
        );
      });
    });
  });

  describe('getRoleName', () => {
    describe('for admin of 1 chapter', () => {
      it.each([
        {
          oldRole: InstanceRoles.chapter_administrator,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.chapter_administrator,
          newRole: InstanceRoles.chapter_administrator,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.chapter_administrator,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.owner,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.owner,
        },
      ])(
        'should return $expected when changing from $oldRole to $newRole',
        ({ oldRole, newRole, userChapters, expected }) => {
          expect(
            getRoleName({
              oldRole,
              newRole,
              userChapters,
            }),
          ).toBe(expected);
        },
      );
    });

    describe('for admin of 2 chapter', () => {
      it.each([
        {
          oldRole: InstanceRoles.chapter_administrator,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.owner,
        },
      ])(
        'should return $expected when changing from $oldRole to $newRole',
        ({ oldRole, newRole, userChapters, expected }) => {
          expect(
            getRoleName({
              oldRole,
              newRole,
              userChapters,
            }),
          ).toBe(expected);
        },
      );
    });

    describe('for admin of chapters', () => {
      it.each([
        {
          oldRole: InstanceRoles.chapter_administrator,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.chapter_administrator,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.owner,
        },
      ])(
        'should return $expected when changing from $oldRole to $newRole',
        ({ oldRole, newRole, userChapters, expected }) => {
          expect(
            getRoleName({
              oldRole,
              newRole,
              userChapters,
            }),
          ).toBe(expected);
        },
      );
    });

    describe('for member of chapters', () => {
      it.each([
        {
          oldRole: InstanceRoles.member,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.member,
        },
        {
          oldRole: InstanceRoles.member,
          newRole: InstanceRoles.chapter_administrator,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.member,
        },
        {
          oldRole: InstanceRoles.member,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.owner,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.member,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.member,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.owner,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.owner,
        },
      ])(
        'should return $expected when changing from $oldRole to $newRole',
        ({ oldRole, newRole, userChapters, expected }) => {
          expect(
            getRoleName({
              oldRole,
              newRole,
              userChapters,
            }),
          ).toBe(expected);
        },
      );
    });

    describe('for member of no chapters', () => {
      it.each([
        {
          oldRole: InstanceRoles.member,
          newRole: InstanceRoles.chapter_administrator,
          userChapters: [],
          expected: InstanceRoles.member,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.owner,
          userChapters: [],
          expected: InstanceRoles.owner,
        },
        {
          oldRole: InstanceRoles.member,
          newRole: InstanceRoles.owner,
          userChapters: [],
          expected: InstanceRoles.owner,
        },
        {
          oldRole: InstanceRoles.owner,
          newRole: InstanceRoles.member,
          userChapters: [],
          expected: InstanceRoles.member,
        },
      ])(
        'should return $expected when changing from $oldRole to $newRole',
        ({ oldRole, newRole, userChapters, expected }) => {
          expect(
            getRoleName({
              oldRole,
              newRole,
              userChapters,
            }),
          ).toBe(expected);
        },
      );
    });
  });
});
