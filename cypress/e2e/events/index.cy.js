describe('events page', () => {
  before(() => {
    cy.exec('npm run db:seed');
    cy.interceptGQL('home');
  });

  it('should contain a list of event cards', () => {
    cy.visit('/events');
    cy.wait('@GQLhome');
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5)
      .as('eventCards');

    cy.get('@eventCards').find('[data-cy="event-canceled"]').should('exist');
    cy.get('@eventCards').find('[data-cy="event-invite-only"]').should('exist');
  });
});
