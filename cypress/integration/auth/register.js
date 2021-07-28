describe('registration', () => {
  beforeEach(() => {
    // This is a bit slow and somewhat overkill, since we only care about the
    // users.  It could be worth just truncating the user table.
    cy.exec('npm run db:reset');
  });
  it('should be possible to register, but only once', () => {
    cy.intercept('http://localhost:5000/graphql', (req) => {
      if (req.body?.operationName?.includes('register')) {
        req.alias = 'register';
      }
    });

    cy.visit('/auth/register');

    cy.get('input[name="first_name"]').type('An');
    cy.get('input[name="last_name"]').type('User');
    cy.get('input[name="email"]').type('an@user.com');
    cy.get('[data-cy="submit button"]').click();

    cy.wait('@register')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('have.property', 'register');
        cy.wrap(response.statusCode).should('eq', 200);
      });

    cy.get('[data-cy="submit button"]').click();

    cy.wait('@register')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('eq', null);
        cy.wrap(response.body).should('have.property', 'errors');
        cy.wrap(response.statusCode).should('eq', 200);
      });
  });
});
