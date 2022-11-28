describe('landing page', () => {
  it('should have lists of events and chapters', () => {
    cy.visit('/');
    cy.contains('Upcoming events');
    cy.get('[data-cy="event-card"]').should('have.length', 2);
    cy.contains('Click for more').click();
    cy.get('[data-cy="event-card"]').should('have.length', 4);
    cy.contains('Chapters');
  });

  it('should have links to events', () => {
    cy.visit('/');
    cy.get('[data-cy="event-card"] [data-cy="event-link"]')
      .first()
      .then(($eventLink) => {
        const eventTitle = $eventLink.text();
        cy.wrap($eventLink).click();
        cy.location('pathname').should('match', /^\/events\/\d+$/);
        cy.get('h1').should('have.text', eventTitle);
      });
  });

  it('should have links to chapters', () => {
    cy.visit('/');
    cy.get('[data-cy="chapter-card"] [data-cy="chaptercard-name"]')
      .first()
      .then(($chapterLink) => {
        const chapterTitle = $chapterLink.text();
        cy.wrap($chapterLink).click();
        cy.location('pathname').should('match', /^\/chapters\/\d+$/);
        cy.get('h1').should('have.text', chapterTitle);
      });
  });
});
