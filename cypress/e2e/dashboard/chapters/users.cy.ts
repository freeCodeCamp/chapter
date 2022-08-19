import { expectToBeRejected } from '../../../support/util';

const chapterId = 1;
const knownEmails = [
  'foo@bar.com',
  'admin@of.chapter.one',
  'banned@chapter.admin',
];

describe('Chapter Users dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });
  it('should have a table of users', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);
    cy.findByRole('table', { name: 'Chapter Users' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'email' }).should('be.visible');
  });

  it('should not be possible to create users', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users/new`, {
      failOnStatusCode: false,
    });
    cy.contains('This page could not be found');
  });

  it('can change user chapter role', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    cy.get('[data-cy=role]').then((roles) => {
      const roleNames = [...roles.map((_, role) => role.innerText)];
      const administratorToMember = roleNames.indexOf('administrator');
      const memberToAdministrator = roleNames.indexOf('member');

      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains('member');
      cy.findByRole('combobox').select('administrator');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]')
        .eq(memberToAdministrator)
        .contains('administrator');

      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains('administrator');
      cy.findByRole('combobox').select('member');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]').eq(administratorToMember).contains('member');

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains('administrator');
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains('member');
    });
  });

  it('rejects chapter admin from changing chapter user role', () => {
    cy.login('admin@of.chapter.one');

    cy.getChapterMembers(chapterId).then((chapterUsers) => {
      const userId = chapterUsers.find(
        ({ user: { email } }) => knownEmails.indexOf(email) === -1,
      ).user.id;
      const selfUserId = chapterUsers.find(
        ({ user: { email } }) => email === 'admin@of.chapter.one',
      ).user.id;
      cy.getChapterRoles().then((roles) => {
        const roleIds = roles.map(({ id }) => id);
        roleIds.forEach((roleId) => {
          cy.changeChapterUserRole({ chapterId, roleId, userId }).then(
            expectToBeRejected,
          );
          cy.changeChapterUserRole({
            chapterId,
            roleId,
            userId: selfUserId,
          }).then(expectToBeRejected);
        });
      });
    });
  });

  it('administrator can ban user from chapter', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    initializeBanVariables();

    cy.get('@rows')
      .filter(':contains("administrator")')
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

  function initializeBanVariables() {
    // We don't want to interact with the instance owner here
    cy.findAllByRole('row').not(':contains("foo@bar.com")').as('rows');
    cy.get('@rows').filter(':contains("member")').as('members');
    cy.get('@rows').filter(':contains("administrator")').as('administrators');
    cy.get('@members')
      .not(':contains("Unban")')
      .not(':contains("Banned")')
      .first()
      .as('firstUnbannedMember');
  }

  it('an admin cannot ban themselves', () => {
    cy.login('admin@of.chapter.one');
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    initializeBanVariables();

    cy.get('@administrators')
      .filter(':contains("admin@of.chapter.one")')
      .as('adminToBan')
      .should('have.length', 1);

    cy.get('@adminToBan').findByRole('button', { name: 'Ban' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('You cannot ban yourself', { matchCase: false });
    cy.get('@adminToBan').find('[data-cy=isBanned]').should('not.exist');
  });

  it('an admin cannot unban themselves', () => {
    cy.login('banned@chapter.admin');
    cy.visit(`/dashboard/chapters/${chapterId}/users`);

    initializeBanVariables();

    cy.get('@administrators')
      .filter(':contains("banned@chapter.admin")')
      .as('adminToUnban')
      .should('have.length', 1);

    cy.get('@adminToUnban').findByRole('button', { name: 'Unban' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('You cannot unban yourself', { matchCase: false });
    cy.get('@adminToUnban').find('[data-cy=isBanned]').should('be.visible');
  });
});
