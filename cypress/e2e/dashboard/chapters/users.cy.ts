import { ChapterMembers } from '../../../../cypress.config';
import { expectToBeRejected } from '../../../support/util';

const chapterId = 1;

// TODO: this is very brittle, since it depends on precisely how we seed the
// database. Can make this always be the id of banned@chapter.admin?
const bannedUserId = 4;

describe('Chapter Users dashboard', () => {
  let chapterRoles;
  let users;
  before(() => {
    cy.fixture('chapterRoles').then((fixture) => {
      chapterRoles = fixture;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
  });
  it('should have a table of users', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);
    cy.findByRole('table', { name: 'Chapter Users' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
  });

  it('should not be possible to create users', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users/new`, {
      failOnStatusCode: false,
    });
    cy.contains('This page could not be found');
  });

  it('can change user chapter role', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);
    const memberRole = chapterRoles.MEMBER;
    const adminRole = chapterRoles.ADMINISTRATOR;

    cy.get('[data-cy=role]').then((roles) => {
      const roleNames = [...roles.map((_, role) => role.innerText)];
      const administratorToMember = roleNames.indexOf(adminRole);
      const memberToAdministrator = roleNames.indexOf(memberRole);

      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains(memberRole);
      cy.findByRole('combobox').select(adminRole);
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]').eq(memberToAdministrator).contains(adminRole);

      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains(adminRole);
      cy.findByRole('combobox').select(memberRole);
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]').eq(administratorToMember).contains(memberRole);

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains(adminRole);
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains(memberRole);
    });
  });

  // Currently only instance owners can change chapter roles
  it('rejects chapter admin from changing chapter user role', () => {
    cy.login(users.chapter1Admin.email);
    const knownNames = Object.keys(users);

    cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
      (chapterUsers) => {
        const userId = chapterUsers.find(
          ({ user: { name } }) => knownNames.indexOf(name) === -1,
        ).user.id;
        const selfUserId = chapterUsers.find(
          ({ user: { name } }) => name === users.chapter1Admin.name,
        ).user.id;
        cy.getChapterRoles().then((roles) => {
          const roleNames = roles.map(({ name }) => name);
          roleNames.forEach((roleName) => {
            cy.changeChapterUserRole({ chapterId, roleName, userId }).then(
              expectToBeRejected,
            );
            cy.changeChapterUserRole({
              chapterId,
              roleName,
              userId: selfUserId,
            }).then(expectToBeRejected);
          });
        });
      },
    );
  });

  function initializeBanVariables() {
    // We don't want to interact with the instance owner here
    cy.findAllByRole('row').not(`:contains("${users.owner.name}")`).as('rows');
    cy.get('@rows').filter(`:contains("${chapterRoles.MEMBER}")`).as('members');
    cy.get('@rows')
      .filter(`:contains("${chapterRoles.ADMINISTRATOR}")`)
      .as('administrators');
    cy.get('@members')
      .not(':contains("Unban")')
      .not(':contains("Banned")')
      .first()
      .as('firstUnbannedMember');
  }

  it('administrator can ban user from chapter', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    initializeBanVariables();

    cy.get('@rows')
      .filter(`:contains("${chapterRoles.ADMINISTRATOR}")`)
      .find('[data-cy=isBanned]')
      .should('have.length', 1);

    cy.get('@firstUnbannedMember')
      .find('[data-cy=isBanned]')
      .should('not.exist');

    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Ban' })
      .click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was banned', { matchCase: false });
    cy.get('@firstUnbannedMember').find('[data-cy=isBanned]').should('exist');
    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Unban' })
      .should('exist');
    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Ban' })
      .should('not.exist');

    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Unban' })
      .click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was unbanned', { matchCase: false });
    cy.get('@firstUnbannedMember')
      .find('[data-cy=isBanned]')
      .should('not.exist');
    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Ban' })
      .should('exist');
    cy.get('@firstUnbannedMember')
      .findByRole('button', { name: 'Unban' })
      .should('not.exist');
  });

  it("admins of other chapters should NOT be able to ban (or unban) that chapter's users", () => {
    cy.login(users.chapter2Admin.email);

    cy.task<ChapterMembers>('getChapterMembers', chapterId).each(
      (member: any) => {
        cy.banUser({ chapterId, userId: member.user.id }).then(
          expectToBeRejected,
        );
        cy.unbanUser({ chapterId, userId: member.user.id }).then(
          expectToBeRejected,
        );
      },
    );
  });

  it('an admin cannot ban themselves', () => {
    cy.login(users.chapter1Admin.email);
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    initializeBanVariables();

    cy.get('@administrators')
      .filter(`:contains("${users.chapter1Admin.name}")`)
      .as('adminToBan')
      .should('have.length', 1);

    cy.get('@adminToBan').findByRole('button', { name: 'Ban' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('You cannot ban yourself', { matchCase: false });
    cy.get('@adminToBan').find('[data-cy=isBanned]').should('not.exist');
  });

  it('an admin cannot unban themselves', () => {
    cy.login(users.bannedAdmin.email);

    cy.unbanUser({ chapterId, userId: bannedUserId }).then(expectToBeRejected);
  });
});
