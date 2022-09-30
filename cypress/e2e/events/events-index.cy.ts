describe('events page', () => {
  before(() => {
    cy.task('seedDb');
  });

  it('should contain a list of event cards', () => {
    cy.interceptGQL('PaginatedEventsWithTotal');
    cy.visit('/events');
    cy.wait('@GQLPaginatedEventsWithTotal');
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="pagination-forward"]').click();
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="pagination-forward"]').click();
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="pagination-forward"]').should('be.disabled');
    cy.get('[data-testid="pagination-back"]').click();
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="pagination-back"]').click();
    cy.get('[data-cy="event-card"]')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="pagination-back"]').should('be.disabled');
  });
});
