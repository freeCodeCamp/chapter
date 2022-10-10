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

  describe('when promoted to administrator of chapter', () => {
    it('instance member should get chapter_administrator instance role', () => {
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.MEMBER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          ]);
        },
      );
      confirmInstanceRole(
        users.testUser.email,
        instanceRoles.CHAPTER_ADMINISTRATOR,
      );
    });

    it('instance owner should keep instance role', () => {
      cy.login();
      cy.task<User>('getUser', users.owner.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.OWNER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          ]);
        },
      );
      confirmInstanceRole(users.owner.email, instanceRoles.OWNER);
    });
  });

  describe('when demoted from administrator of chapter', () => {
    it('chapter_administrator should receive member instance role', () => {
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(({ id }) => {
        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ]);
        confirmInstanceRole(
          users.testUser.email,
          instanceRoles.CHAPTER_ADMINISTRATOR,
        );

        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
        ]);
      });

      confirmInstanceRole(users.testUser.email, instanceRoles.MEMBER);
    });

    it('administrator of multiple chapters should keep chapter_administrator instance role, when demoted in one chapter', () => {
      cy.joinChapter(secondChapterId);
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(({ id }) => {
        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          { chapterId: secondChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ]);
        confirmInstanceRole(
          users.testUser.email,
          instanceRoles.CHAPTER_ADMINISTRATOR,
        );

        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
        ]);
      });

      confirmInstanceRole(
        users.testUser.email,
        instanceRoles.CHAPTER_ADMINISTRATOR,
      );
    });

    it('administrator of multiple chapters should receive member instance role when demoted from last administrator role', () => {
      cy.joinChapter(secondChapterId);
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(({ id }) => {
        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          { chapterId: secondChapterId, roleName: chapterRoles.ADMINISTRATOR },
        ]);
        confirmInstanceRole(
          users.testUser.email,
          instanceRoles.CHAPTER_ADMINISTRATOR,
        );

        sequenceChangeChapterUserRole(id, [
          { chapterId: firstChapterId, roleName: chapterRoles.MEMBER },
          { chapterId: secondChapterId, roleName: chapterRoles.MEMBER },
        ]);
      });
      confirmInstanceRole(users.testUser.email, instanceRoles.MEMBER);
    });

    it('instance owner should keep instance role', () => {
      cy.login();
      cy.task<User>('getUser', users.owner.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.OWNER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
            { chapterId: secondChapterId, roleName: chapterRoles.MEMBER },
          ]);
        },
      );
      confirmInstanceRole(users.owner.email, instanceRoles.OWNER);
    });
  });

  describe('chapter_administrator instance role', () => {
    it('should be instance role again, when administrator of chapter is demoted from instance owner to instance member', () => {
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.MEMBER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          ]);
          cy.changeInstanceUserRole({
            roleName: instanceRoles.OWNER,
            userId: id,
          }).then(expectNoErrors);

          confirmInstanceRole(users.testUser.email, instanceRoles.OWNER);
          cy.changeInstanceUserRole({
            roleName: instanceRoles.MEMBER,
            userId: id,
          }).then(expectNoErrors);
        },
      );
      confirmInstanceRole(
        users.testUser.email,
        instanceRoles.CHAPTER_ADMINISTRATOR,
      );
    });

    it('should be kept when changing chapter_administrator instance role to member for administrator of chapter', () => {
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.MEMBER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          ]);
          confirmInstanceRole(
            users.testUser.email,
            instanceRoles.CHAPTER_ADMINISTRATOR,
          );

          cy.changeInstanceUserRole({
            roleName: instanceRoles.MEMBER,
            userId: id,
          }).then(expectNoErrors);
        },
      );
      confirmInstanceRole(
        users.testUser.email,
        instanceRoles.CHAPTER_ADMINISTRATOR,
      );
    });

    it('should be changed to owner when changing instance role to owner, for administrator of chapter', () => {
      cy.login();
      cy.task<User>('getUser', users.testUser.email).then(
        ({ id, instance_role }) => {
          expect(instance_role.name).to.eq(instanceRoles.MEMBER);
          sequenceChangeChapterUserRole(id, [
            { chapterId: firstChapterId, roleName: chapterRoles.ADMINISTRATOR },
          ]);
          confirmInstanceRole(
            users.testUser.email,
            instanceRoles.CHAPTER_ADMINISTRATOR,
          );

          cy.changeInstanceUserRole({
            roleName: instanceRoles.OWNER,
            userId: id,
          }).then(expectNoErrors);
        },
      );
      confirmInstanceRole(users.testUser.email, instanceRoles.OWNER);
    });

    it('should not be visible on users list', () => {
      cy.login();
      cy.visit('/dashboard/users');
      cy.findByRole('table', { name: 'Instance Users' }).should('be.visible');
      cy.contains('chapter_administrator').should('not.exist');
    });
  });

  function confirmInstanceRole(email: string, expectedRole: string) {
    cy.task<User>('getUser', email).then(({ instance_role: { name } }) => {
      expect(name).to.eq(expectedRole);
    });
  }

  function sequenceChangeChapterUserRole(
    userId: number,
    changes: { chapterId: number; roleName: string }[],
  ) {
    for (const { chapterId, roleName } of changes) {
      cy.changeChapterUserRole({ chapterId, userId, roleName }).then(
        expectNoErrors,
      );
    }
  }
});
