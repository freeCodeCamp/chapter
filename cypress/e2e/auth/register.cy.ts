describe('registration', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });
  beforeEach(() => {
    cy.exec('npm run db:reset:users');
  });

  it('should redirect to login after successful registration', () => {
    cy.interceptGQL('register');
    cy.registerViaUI('An User', 'an@user.com');
    cy.wait('@GQLregister')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('have.property', 'register');
        cy.wrap(response.statusCode).should('eq', 200);
      });
    cy.contains(/User registered/);
    cy.location('pathname').should('eq', '/auth/login');
  });

  it('should not allow registation, when using the same email twice', () => {
    cy.register('An User', 'an@user.com');

    cy.interceptGQL('register');
    cy.registerViaUI('An User', 'an@user.com');
    cy.wait('@GQLregister')
      .its('response')
      .then((response) => {
        cy.wrap(response.body.data).should('eq', null);
        cy.wrap(response.body).should('have.property', 'errors');
        cy.wrap(response.statusCode).should('eq', 200);
      });
    cy.contains(/Something went wrong/);
  });
});
