describe('login', () => {
  beforeEach(() => {
    cy.exec('npm run db:reset');
    cy.intercept('http://localhost:5000/graphql', (req) => {
      if (req.body?.operationName?.includes('register')) {
        req.alias = 'register';
      }
    });
    cy.register('An', 'User', 'an@user.com');
    cy.wait('@register');
    cy.mhDeleteAll();
  });

  it('should be possible to log in via magic link', () => {
    cy.visit('/auth/login');

    cy.get('input[name="email"]').type('an@user.com');
    cy.get('[data-cy="login button"]').click();

    cy.contains('We sent you a magic link to your email');

    cy.mhGetAllMails().mhFirst().as('login-mail');
    cy.get('@login-mail').mhGetSubject().should('eq', 'Login to Chapter');
    cy.get('@login-mail')
      .mhGetBody()
      .should('include', 'Click here to log in to chapter');
    cy.get('@login-mail')
      .mhGetBody()
      .then((body) => {
        const href = body.match(/<a href=3D([^>]+?)>/)[1];
        cy.wrap(href).should('include', '/auth/token?token=');
        // when emails encode long strings they split them into multiple lines,
        // so the extra =\r\n need to be removed
        const token = href.match(/token=3D([\s\S]*)/)[1].replace(/=\s\s/g, '');
        cy.visit(`/auth/token?token=${token}`);
        cy.contains('Logging you in');
        cy.location('pathname').should('eq', '/');
        cy.get('[data-cy="logout button"]').click();
        cy.get('[data-cy="logout button"]').should('not.exist');
      });
  });
});
