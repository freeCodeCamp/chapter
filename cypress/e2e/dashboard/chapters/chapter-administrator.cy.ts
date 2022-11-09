import { User } from '../../../../cypress.config';
import { expectNoErrors } from '../../../support/util';

const firstChapterId = 1;
const secondChapterId = 2;

describe('Chapter Administrator', () => {
  let chapterRoles;
  let instanceRoles;
  let users;
  before(() => {
    cy.fixture('chapterRoles').then((fixture) => {
      chapterRoles = fixture;
    });
    cy.fixture('instanceRoles').then((fixture) => {
      instanceRoles = fixture;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login(users.testUser.email);
    cy.joinChapter(firstChapterId);
  });

  function confirmInstanceRole(email: string, expectedRole: string) {
    cy.task<User>('getUser', email).then(({ instance_role: { name } }) => {
      expect(name).to.eq(expectedRole);
    });
  }

  function applyChapterRoleChanges(
    userId: number,
    changes: { chapterId: number; roleName: string }[],
  ) {
    for (const { chapterId, roleName } of changes) {
      cy.changeChapterUserRole({ chapterId, userId, roleName }).then(
        expectNoErrors,
      );
    }
  }

  function changeChapterRole({
    userEmail,
    initialInstanceRole,
    changesToApply,
    expectedInstanceRole,
  }: {
    userEmail: string;
    initialInstanceRole: string;
    changesToApply: { chapterId: number; roleName: string }[];
    expectedInstanceRole: string;
  }) {
    cy.task<User>('getUser', userEmail).then(({ id, instance_role }) => {
      expect(instance_role.name).to.eq(initialInstanceRole);
      applyChapterRoleChanges(id, changesToApply);
      confirmInstanceRole(userEmail, expectedInstanceRole);
    });
  }

  function changeInstanceRole({
    userEmail,
    initialRole,
    roleToApply,
    expectedRole,
  }: {
    userEmail: string;
    initialRole: string;
    roleToApply: string;
    expectedRole: string;
  }) {
    cy.task<User>('getUser', userEmail).then(({ id, instance_role }) => {
      expect(instance_role.name).to.eq(initialRole);
      cy.changeInstanceUserRole({ roleName: roleToApply, userId: id }).then(
        expectNoErrors,
      );
      confirmInstanceRole(userEmail, expectedRole);
    });
  }

  describe('when promoted to administrator of chapter', () => {
    it('instance member should get chapter_administrator instance role', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
    });

    it('instance owner should keep instance role', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.owner.email,
        initialInstanceRole: instanceRoles.OWNER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.OWNER,
      });
    });
  });

  describe('when demoted from administrator of chapter', () => {
    it('chapter_administrator should receive member instance role', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
        ],
        expectedInstanceRole: instanceRoles.MEMBER,
      });
    });

    it('administrator of multiple chapters should keep chapter_administrator instance role, when demoted in one chapter', () => {
      cy.joinChapter(secondChapterId);
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          { chapterId: secondChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
    });

    it('administrator of multiple chapters should receive member instance role when demoted from last administrator role', () => {
      cy.joinChapter(secondChapterId);
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          { chapterId: secondChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
          { chapterId: secondChapterId, roleName: chapterRoles.MEMBER },
        ],
        expectedInstanceRole: instanceRoles.MEMBER,
      });
    });

    it('instance owner should keep instance role', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.owner.email,
        initialInstanceRole: instanceRoles.OWNER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          { chapterId: secondChapterId, roleName: chapterRoles.MEMBER },
        ],
        expectedInstanceRole: instanceRoles.OWNER,
      });
    });
  });

  describe('chapter_administrator instance role', () => {
    it('should be instance role again, when administrator of chapter is demoted from instance owner to instance member', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeInstanceRole({
        userEmail: users.testUser.email,
        initialRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        roleToApply: instanceRoles.OWNER,
        expectedRole: instanceRoles.OWNER,
      });
      changeInstanceRole({
        userEmail: users.testUser.email,
        initialRole: instanceRoles.OWNER,
        roleToApply: instanceRoles.MEMBER,
        expectedRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
    });

    it('should be kept when changing chapter_administrator instance role to member for administrator of chapter', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeInstanceRole({
        userEmail: users.testUser.email,
        initialRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        roleToApply: instanceRoles.MEMBER,
        expectedRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
    });

    it('should be changed to owner when changing instance role to owner, for administrator of chapter', () => {
      cy.login();
      changeChapterRole({
        userEmail: users.testUser.email,
        initialInstanceRole: instanceRoles.MEMBER,
        changesToApply: [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ],
        expectedInstanceRole: instanceRoles.CHAPTER_ADMINISTRATOR,
      });
      changeInstanceRole({
        userEmail: users.testUser.email,
        initialRole: instanceRoles.CHAPTER_ADMINISTRATOR,
        roleToApply: instanceRoles.OWNER,
        expectedRole: instanceRoles.OWNER,
      });
    });

    it('should be changed to member when chapter administrator leaves chapter', () => {
      confirmInstanceRole(
        users.chapter1Admin.email,
        instanceRoles.CHAPTER_ADMINISTRATOR,
      );
      cy.login(users.chapter1Admin.email);
      cy.leaveChapter(firstChapterId);
      confirmInstanceRole(users.chapter1Admin.email, instanceRoles.MEMBER);
    });

    it('should not be visible on users list', () => {
      cy.login();
      cy.visit('/dashboard/users');
      cy.findByRole('table', { name: 'Instance Users' }).should('be.visible');
      cy.contains('chapter_administrator').should('not.exist');
    });
  });
});
