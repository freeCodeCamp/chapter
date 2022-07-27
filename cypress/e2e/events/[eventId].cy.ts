import { expectToBeRejected } from '../../support/util';

describe('event page', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
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
    cy.get('[data-cy="event-image"]')
      .should('be.visible')
      .and('have.attr', 'alt', '');
  });

  // TODO: we need to rework how we register users before this test can be used.
  // Currently it's automatic, but gives them a placeholder name.
  it.skip('ask the user to login before they can RSVP', () => {
    const fix = { email: 'test@user.org', firstName: 'Test', lastName: 'User' };

    cy.findByRole('button', { name: 'RSVP' }).click();
    cy.findByRole('heading', { name: 'Login' }).should('be.visible');
    cy.findByRole('textbox', { name: 'Email' }).as('email').type(fix.email);
    cy.findByRole('button', { name: 'Login' }).as('login-submit').click();
    // TODO: nicer response to un-registered users
    cy.contains('No users found');

    // TODO: should this be called 'Switch to registration'?
    cy.findByRole('button', { name: 'Register' }).click();

    cy.get('@email').should('have.value', fix.email);
    cy.findByRole('textbox', { name: 'First name' }).type(fix.firstName);
    cy.findByRole('textbox', { name: 'Last name' }).type(fix.lastName);

    cy.interceptGQL('register');
    cy.findByRole('button', { name: 'Register' }).click();
    cy.wait('@GQLregister');

    cy.contains(/User registered/);
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
        // @ts-expect-error we don't use email to login, so this will need to be
        // updated
        cy.login(token);
        // NOTE: we can't cy.get('@login-submit').should('not.exist') here
        // because that dom element is no longer in the DOM, resolves to
        // undefined and the test fails.
        cy.contains('You want to join this?');
        cy.findByRole('button', { name: 'Confirm' }).should('be.visible');
      });
  });

  it('should be possible to RSVP and cancel', () => {
    cy.changeUser('test@user.org');
    cy.login();

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
    cy.findByRole('button', { name: 'Cancel' }).should('not.exist');
  });

  it('should be possible to change event subscription', () => {
    cy.changeUser('test@user.org');
    cy.login();

    // RSVPing is required for managing event subscription
    cy.findByRole('button', { name: 'RSVP' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains(/You are subscribed/);
    cy.findByRole('button', { name: 'Unsubscribe' }).click();
    cy.findByRole('alertdialog').contains('Unsubscribe from event');
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('unsubscribed from');

    cy.contains(/Not subscribed/);
    cy.findByRole('button', { name: 'Subscribe' }).click();
    cy.findByRole('alertdialog').contains('subscribe?');
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('subscribed to');
  });

  it('should reject requests from logged out users, non-members and banned users', () => {
    const rsvpVariables = { eventId: 1, chapterId: 1 };
    const subscriptionVariables = { eventId: 1 };
    // logged out user
    cy.logout();

    cy.rsvpToEvent(rsvpVariables, { withAuth: false }).then(expectToBeRejected);
    cy.subscribeToEvent(subscriptionVariables, { withAuth: false }).then(
      expectToBeRejected,
    );
    cy.unsubscribeFromEvent(subscriptionVariables, { withAuth: false }).then(
      expectToBeRejected,
    );

    // newly registered user (without a chapter_users record)
    cy.changeUser('test@user.org');
    cy.login();

    cy.rsvpToEvent(rsvpVariables).then(expectToBeRejected);
    cy.subscribeToEvent(subscriptionVariables).then(expectToBeRejected);
    cy.unsubscribeFromEvent(subscriptionVariables).then(expectToBeRejected);

    // banned user
    cy.changeUser('banned@chapter.admin');
    cy.login();

    cy.rsvpToEvent(rsvpVariables).then(expectToBeRejected);
    cy.subscribeToEvent(subscriptionVariables).then(expectToBeRejected);
    cy.unsubscribeFromEvent(subscriptionVariables).then(expectToBeRejected);
  });

  it('should email the chapter administrator when a user RSVPs', () => {
    cy.changeUser('test@user.org');
    cy.login();

    cy.findByRole('button', { name: 'RSVP' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.waitUntilMail();
    cy.mhGetMailsByRecipient('admin@of.chapter.one').should('have.length', 1);
    cy.mhGetMailsByRecipient('admin@of.chapter.one').mhFirst().as('rsvp-mail');
    cy.get('@rsvp-mail')
      .mhGetSubject()
      .should('match', /^New RSVP for/);
    cy.get('@rsvp-mail')
      .mhGetBody()
      .should('include', "User Test User has RSVP'd");
  });
});
