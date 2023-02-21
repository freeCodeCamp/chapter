const deniedText = 'Access denied!';
// TODO: get these from the API, rather than relying on the seeding order
const bannedChapter = 1;
const bannedEvent = 1;
const bannedVenue = 1;

function visitBannedDashboards() {
  cy.visit(`/dashboard/chapters/${bannedChapter}`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/chapters/${bannedChapter}/edit`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/events/${bannedEvent}`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/events/${bannedEvent}/edit`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/venues/${bannedVenue}`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/chapters/${bannedChapter}/venues/${bannedVenue}/edit`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/chapters/${bannedChapter}/users`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/sponsors/1/edit`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);
}

function visitNonMemberDashboards() {
  cy.visit(`/dashboard/sponsors`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit(`/dashboard/sponsors/1`);
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit('/dashboard/chapters');
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit('/dashboard/events');
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);

  cy.visit('/dashboard/venues');
  cy.get('[data-cy=loading-error]').should('be.visible');
  cy.contains(deniedText);
}

describe('all dashboards', () => {
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  it('they should be forbidden to the admin banned from that chapter', () => {
    cy.login(users.bannedAdmin.email);
    visitBannedDashboards();
  });

  it('they should be forbidden to members', () => {
    cy.login(users.testUser.email);
    // It doesn't matter which chapter we visit, as a member, they all should be
    // forbidden.
    visitBannedDashboards();
    visitNonMemberDashboards();
  });
});
