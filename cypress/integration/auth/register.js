describe('registration', () => {
  beforeEach(() => {
    // This is a bit slow and somewhat overkill, since we only care about the
    // users.  It could be worth just truncating the user table.
    cy.exec('npm run db:seed');
  });
  it('should be possible to register, but only once', () => {
    cy.interceptGQL('register');

    cy.registerViaUI('An', 'User', 'an@user.com');

    cy.wait('@GQLregister')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('have.property', 'register');
        cy.wrap(response.statusCode).should('eq', 200);
      });

    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@GQLregister')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('eq', null);
        cy.wrap(response.body).should('have.property', 'errors');
        cy.wrap(response.statusCode).should('eq', 200);
      });
  });
});
