// TODO: consider re-implementing this test as a programmatic call to Auth0
// followed by a call to our server
// https://auth0.com/blog/end-to-end-testing-with-cypress-and-auth0/ covers the
// first part
describe.skip('login', () => {
  beforeEach(() => {
    cy.task('seedDb');
    cy.register('An User', 'an@user.com');
    cy.mhDeleteAll();
  });

  it('should return an error if the user is no longer in the db', () => {
    const body = {
      operationName: 'me',
      query: 'query me { me {id} }',
    };
    cy.request({
      method: 'POST',
      url: Cypress.env('GQL_URL'),
      body,
      headers: {
        authorization: `Bearer ${Cypress.env('TOKEN_DELETED_USER')}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('User not found');
    });
  });
});
