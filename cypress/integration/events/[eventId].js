describe('event page', () => {
  beforeEach(() => {
    cy.exec('npm run db:reset');
    cy.visit('/events/1');
    cy.mhDeleteAll();
  });
  it('should render correctly', () => {
    cy.get('h1').should('not.have.text', 'Loading...');
    cy.get('[data-cy="rsvp-button"]').should('be.visible');
    cy.get('[data-cy="rsvps-heading"]')
      .should('be.visible')
      .next()
      .should('be.visible')
      .should('match', 'ul');
    cy.get('[data-cy="waitlist-heading"]')
      .should('be.visible')
      .next()
      .should('be.visible')
      .should('match', 'ul');
  });

  it('ask the user to login before they can RSVP', () => {
    const fix = { email: 'test@user.org', firstName: 'Test', lastName: 'User' };

    cy.findByRole('button', { name: 'RSVP' }).click();
    cy.findByRole('heading', { name: 'Login' }).should('be.visible');
    cy.findByRole('textbox', { name: 'Email' }).as('email').type(fix.email);
    cy.findByRole('button', { name: 'Login' }).as('login-submit').click();
    // TODO: nicer response to un-registered users
    cy.contains('USER_NOT_FOUND');

    // TODO: should this be called 'Switch to registration'?
    cy.findByRole('button', { name: 'Register' }).click();

    cy.get('@email').should('have.value', fix.email);
    cy.findByRole('textbox', { name: 'First name' }).type(fix.firstName);
    cy.findByRole('textbox', { name: 'Last name' }).type(fix.lastName);

    cy.interceptGQL('register');
    cy.findByRole('button', { name: 'Register' }).click();
    cy.wait('@GQLregister');

    // TODO: should this be called 'Switch to login'?
    cy.findByRole('button', { name: 'Login' }).click();
    cy.get('@login-submit').click();
    // TODO: data-cy? findByRole?
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
        cy.login(token);
        // NOTE: we can't cy.get('@login-submit').should('not.exist') here
        // because that dom element is no longer in the DOM, resolves to
        // undefined and the test fails.
        cy.findByRole('button', { name: 'Login' }).should('not.exist');
        cy.findByRole('button', { name: 'Confirm' }).should('be.visible');
      });
  });

  it('should be possible to RSVP and cancel', () => {
    cy.register();
    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.reload();

    cy.get('[data-cy="rsvps-heading"]')
      .next()
      .as('rsvp-list')
      .within(() => {
        cy.findByText('Test User').should('not.exist');
      });

    cy.findByRole('button', { name: 'RSVP' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.get('@rsvp-list').within(() => {
      cy.findByText('Test User').should('exist');
    });

    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.get('@rsvp-list').within(() => {
      cy.findByText('Test User').should('not.exist');
    });
  });
});
