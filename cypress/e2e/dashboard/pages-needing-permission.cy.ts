const deniedText = 'Access denied!';
// TODO: get these from the API, rather than relying on the seeding order
const bannedChapter = 1;
const bannedEvent = 1;
const bannedVenue = 1;

describe('all dashboards', () => {
  it('they should be forbidden to the admin banned from that chapter', () => {
    cy.login('banned@chapter.admin');
    visitBannedDashboards();
  });

  it('they should be forbidden to members', () => {
    cy.login('test@member.org');
    // It doesn't matter which chapter we visit, as a member, they all should be
    // forbidden.
    visitBannedDashboards();
    visitNonMemberDashboards();
  });

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
  }
});
