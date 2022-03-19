describe('chapter dashboard', () => {
  it('should have link to add event for chapter', () => {
    cy.visit('/dashboard/chapters/1');
    cy.get('a[href="/dashboard/chapters/1/new_event"').should('be.visible');
  });
});
