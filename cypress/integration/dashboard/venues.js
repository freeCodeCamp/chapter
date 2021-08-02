describe('venues dashboard', () => {
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Venues');
  });

  it('should have links to view, create and edit venues', () => {
    cy.visit('/dashboard/venues');
    cy.get('a[href="/dashboard/venues/1"]').should('be.visible');
    cy.get('a[href="/dashboard/venues/new"]').should('be.visible');
    cy.get('a[href="/dashboard/venues/1/edit"]').should('be.visible');
  });
});
