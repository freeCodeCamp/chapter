describe('landing page', () => {
  it('should have lists of events and chapters', () => {
    cy.visit('/');
    cy.contains('Upcoming events');
    cy.get('[data-cy="event card"]').should('have.length', 2);
    cy.contains('Click for more').click();
    cy.get('[data-cy="event card"]').should('have.length', 4);
    cy.contains('Chapters');
  });
});
