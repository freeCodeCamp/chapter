describe('events page', () => {
  before(() => {
    cy.exec('npm run db:reset');
  });

  it('should contain a list of event cards', () => {
    cy.visit('/events');
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 15)
      .as('eventCards');
    cy.get('@eventCards').find('[data-cy="event-canceled"]').should('exist');
    cy.get('@eventCards').find('[data-cy="event-invite-only"]').should('exist');
  });
});
