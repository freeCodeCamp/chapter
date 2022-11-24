describe('menu', () => {
  it('should show a link to the dashboard for an owner', () => {
    cy.login('foo@bar.com');
    cy.visit('/');
    cy.get('[data-cy=menu-button]').click();
    cy.get('[data-cy=menu-dashboard-link]').should('be.visible');
  });

  it('should NOT show a link to the dashboard for a member', () => {
    cy.login('test@user.org');
    cy.visit('/');
    cy.get('[data-cy=menu-button]').click();
    cy.get('[data-cy=menu-dashboard-link]').should('not.exist');
  });

  it('should show a link to the dashboard for an admin', () => {
    cy.login('admin@of.chapter.one');
    cy.visit('/');
    cy.get('[data-cy=menu-button]').click();
    cy.get('[data-cy=menu-dashboard-link]').should('be.visible');
  });
});
