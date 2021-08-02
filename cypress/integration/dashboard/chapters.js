describe('chapters dashboard', () => {
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/chapters"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Chapters');
  });

  it('should have links to view, create and edit chapters', () => {
    cy.visit('/dashboard/chapters');
    cy.get('a[href="/dashboard/chapters/1"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters/new"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters/1/edit"]').should('be.visible');
  });
});
