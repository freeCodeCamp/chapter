describe('Chapter Users dashboard', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });

  beforeEach(() => {
    cy.login();
  });
  it('should have a table of users', () => {
    cy.visit('/dashboard/chapters/1/users');
    cy.findByRole('table', { name: 'Chapter Users' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'email' }).should('be.visible');
  });

  it('should not be possible to create users', () => {
    cy.visit('/dashboard/chapters/1/users/new', { failOnStatusCode: false });
    cy.contains('This page could not be found');
  });
});
