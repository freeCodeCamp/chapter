describe('dashboard', () => {
  it('should have links to the events, chapters and venues dashboards', () => {
    cy.visit('/dashboard');
    cy.get('a[href="/dashboard/events"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters"]').should('be.visible');
    cy.get('a[href="/dashboard/venues"]').should('be.visible');
  });
});
