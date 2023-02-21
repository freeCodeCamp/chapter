import { ChapterMembers, EventUsers, User } from '../../../../cypress.config';
import { expectError, expectToBeRejected } from '../../../support/util';

const chapterId = 1;

describe('Chapter Users dashboard', () => {
  let chapterRoles;
  let users;
  let bannedUserId;
  before(() => {
    cy.fixture('chapterRoles').then((fixture) => {
      chapterRoles = fixture;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
      cy.task<User>('getUser', users.bannedAdmin.email).then(({ id }) => {
        bannedUserId = id;
      });
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
  });
  it('should have a table of users', () => {
    cy.visit(`/dashboard/chapters/${chapterId}/users`);
    cy.findByRole('table', { name: /Users$/ }).should('be.visible');
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
    cy.get('@firstUnbannedMember')
      .find('[data-cy=user-name]')
      .invoke('text')
      .as('firstUnbannedName');
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

    cy.get('@firstUnbannedMember').find('button[data-cy="banUser"]').click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was banned', { matchCase: false });

    cy.get('@firstUnbannedMember').find('[data-cy=isBanned]').should('exist');
    cy.get('@firstUnbannedMember')
      .find('button[data-cy="unbanUser"]')
      .should('exist');
    cy.get('@firstUnbannedMember')
      .find('button[data-cy="banUser"]')
      .should('not.exist');
    cy.get<string>('@firstUnbannedName').then((userName) => {
      cy.getChapterEvents(chapterId).then((events) => {
        const eventIds = events.map(({ id }) => id);
        eventIds.forEach((eventId) => {
          cy.task<EventUsers>('getEventUsers', eventId).then((eventUsers) => {
            const eventUser = eventUsers.find(
              ({ user: { name } }) => name === userName,
            );
            expect(eventUser).to.be.undefined;
          });
        });
      });
    });

    cy.get('@firstUnbannedMember').find('button[data-cy="unbanUser"]').click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was unbanned', { matchCase: false });
    cy.get('@firstUnbannedMember')
      .find('[data-cy=isBanned]')
      .should('not.exist');
    cy.get('@firstUnbannedMember')
      .find('button[data-cy="banUser"]')
      .should('exist');
    cy.get('@firstUnbannedMember')
      .find('button[data-cy="unbanUser"]')
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

    cy.get('@adminToBan')
      .find('button[data-cy="banUser"]')
      .should('be.disabled');

    cy.task<User>('getUser', 'admin@of.chapter.one').then(({ id }) => {
      cy.banUser({ chapterId, userId: id }).then(
        expectError('You cannot ban yourself'),
      );
    });
    cy.get('@adminToBan').find('[data-cy=isBanned]').should('not.exist');
  });

  it('an admin cannot unban themselves', () => {
    cy.login(users.bannedAdmin.email);

    cy.unbanUser({ chapterId, userId: bannedUserId }).then(expectToBeRejected);
  });

  it('instance owner cannot ban another instance owner from chapter', () => {
    cy.task('promoteToOwner', { email: 'admin@of.chapter.one' });

    cy.task<User>('getUser', 'admin@of.chapter.one').then(({ id }) => {
      cy.banUser({ chapterId, userId: id }).then(
        expectError('You cannot ban this user'),
      );
    });
  });

  it('rejects chapter admin from unbanning admin', () => {
    cy.login(users.chapter1Admin.email);

    initializeBanVariables();

    cy.get('@administrators')
      .filter(`:contains("${users.bannedAdmin.name}")`)
      .as('adminToUnban')
      .should('have.length', 1);

    cy.get('@adminToUnban')
      .find('button[data-cy="unbanUser"]')
      .should('be.disabled');
    cy.unbanUser({ chapterId, userId: bannedUserId }).then(
      expectError('You cannot unban this user'),
    );
  });
});
