describe('event page', () => {
  it('should render correctly', () => {
    cy.visit('/events/1');
    cy.get('h1').should('not.have.text', 'Loading...');
    cy.get('[data-cy="rsvp button"]').should('be.visible');
    cy.get('[data-cy="rsvps heading"]')
      .should('be.visible')
      .next()
      .should('be.visible')
      .should('match', 'ul');
    cy.get('[data-cy="waitlist heading"]')
      .should('be.visible')
      .next()
      .should('be.visible')
      .should('match', 'ul');
  });
});
