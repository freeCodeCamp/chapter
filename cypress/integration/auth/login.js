describe('login', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.register('An', 'User', 'an@user.com');
    cy.mhDeleteAll();
  });

  it('should be possible to log in via magic link', () => {
    cy.visit('/auth/login');

    cy.get('input[name="email"]').type('an@user.com');
    cy.get('[data-cy="login-button"]').click();

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
        cy.get('[data-cy="logout-button"]').click();
        cy.get('[data-cy="logout-button"]').should('not.exist');
      });
  });

  it('should redirect to /auth/login after the token expires', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', Cypress.env('JWT_EXPIRED'));
    });
    cy.visit('/');
    cy.location('pathname').should('eq', '/auth/login');
    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should clear the JWT if it has no signature', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', Cypress.env('JWT_UNSIGNED'));
    });
    cy.visit('/');
    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should clear the JWT if it is malformed', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', Cypress.env('JWT_MALFORMED'));
    });
    cy.visit('/');
    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should return an error if the user is no longer in the db', () => {
    const body = {
      operationName: 'me',
      query: 'query me { me {id} }',
    };
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/graphql',
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
