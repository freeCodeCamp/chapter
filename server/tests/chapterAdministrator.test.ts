import { ChapterRoles } from '../prisma/generator/factories/chapterRoles.factory';
import { InstanceRoles } from '../prisma/generator/factories/instanceRoles.factory';
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
      it.each([
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.owner,
          description: 'admin of 1 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.owner,
          description: 'admin of 1 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.owner,
          description: 'admin of 2 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.owner,
          description: 'admin of 2 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.owner,
          description: 'admin of chapters',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.owner,
          description: 'admin of chapters',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.owner,
          description: 'member of chapters',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.owner,
          description: 'member of chapters',
        },
      ])(
        'should return $expected when changing $description to chapter $changedChapterId $newChapterRole',
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

    describe('for instance chapter_administrator', () => {
      it.each([
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.member,
          description: 'admin of 1 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithChapter1Admin,
          expected: InstanceRoles.chapter_administrator,
          description: 'admin of 1 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.chapter_administrator,
          description: 'admin of 2 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithChapter2Admin,
          expected: InstanceRoles.chapter_administrator,
          description: 'admin of 2 chapter',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.chapter_administrator,
          description: 'admin of chapters',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithTwoAdmins,
          expected: InstanceRoles.chapter_administrator,
          description: 'admin of chapters',
        },
      ])(
        'should return $expected when changing $description to chapter $changedChapterId $newChapterRole',
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

    describe('for instance member', () => {
      it.each([
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.member,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.member,
          description: 'member of chapters',
        },
        {
          changedChapterId: 1,
          newChapterRole: ChapterRoles.administrator,
          userChapters: userChaptersWithTwoMembers,
          expected: InstanceRoles.chapter_administrator,
          description: 'member of chapters',
        },
      ])(
        'should return $expected when changing $description to chapter $changedChapterId $newChapterRole',
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

  describe('getRoleName', () => {
    it.each([
      {
        oldRole: InstanceRoles.chapter_administrator,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithChapter1Admin,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of 1 chapter',
      },
      {
        oldRole: InstanceRoles.chapter_administrator,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithChapter2Admin,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of 2 chapter',
      },
      {
        oldRole: InstanceRoles.chapter_administrator,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithTwoAdmins,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of chapters',
      },
      {
        oldRole: InstanceRoles.member,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithTwoMembers,
        expected: InstanceRoles.member,
        description: 'member of chapters',
      },
      {
        oldRole: InstanceRoles.member,
        newRole: InstanceRoles.chapter_administrator,
        userChapters: userChaptersWithTwoMembers,
        expected: InstanceRoles.chapter_administrator,
        description: 'member of chapters',
      },
      {
        oldRole: InstanceRoles.chapter_administrator,
        newRole: InstanceRoles.chapter_administrator,
        userChapters: userChaptersWithChapter1Admin,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of 1 chapter',
      },
      {
        oldRole: InstanceRoles.member,
        newRole: InstanceRoles.owner,
        userChapters: userChaptersWithTwoMembers,
        expected: InstanceRoles.owner,
        description: 'member of chapters',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithChapter1Admin,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of 1 chapter',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithChapter2Admin,
        expected: InstanceRoles.chapter_administrator,
        description: 'admin of 2 chapter',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.member,
        userChapters: userChaptersWithTwoMembers,
        expected: InstanceRoles.member,
        description: 'member of chapters',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.owner,
        userChapters: userChaptersWithChapter1Admin,
        expected: InstanceRoles.owner,
        description: 'admin of 1 chapter',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.owner,
        userChapters: userChaptersWithChapter2Admin,
        expected: InstanceRoles.owner,
        description: 'admin of 2 chapter',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.owner,
        userChapters: userChaptersWithTwoAdmins,
        expected: InstanceRoles.owner,
        description: 'admin of chapters',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.owner,
        userChapters: userChaptersWithTwoMembers,
        expected: InstanceRoles.owner,
        description: 'member of chapters',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.owner,
        userChapters: [],
        expected: InstanceRoles.owner,
        description: 'member of no chapters',
      },
      {
        oldRole: InstanceRoles.member,
        newRole: InstanceRoles.owner,
        userChapters: [],
        expected: InstanceRoles.owner,
        description: 'member of no chapters',
      },
      {
        oldRole: InstanceRoles.owner,
        newRole: InstanceRoles.member,
        userChapters: [],
        expected: InstanceRoles.member,
        description: 'member of no chapters',
      },
    ])(
      'should return $expected when changing from $oldRole to $newRole for $description',
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
