import { Events, EventUsers } from '../../../cypress.config';
import { expectToBeRejected } from '../../support/util';

describe('event page', () => {
  let chapterId;
  let eventId;
  let inviteOnlyEventId;
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.task<Events>('getEvents').then((events) => {
      ({ id: eventId, chapter_id: chapterId } = events.find(
        (event) => !event.invite_only,
      ));
      inviteOnlyEventId = events.find((event) => event.invite_only).id;
    });
    cy.mhDeleteAll();
  });

  describe('event open for all', () => {
    beforeEach(() => {
      cy.visit(`/events/${eventId}`);
    });

    it('should render correctly', () => {
      cy.get('h1').should('not.have.text', 'Loading...');
      cy.get('[data-cy="attend-button"]').should('be.visible');
      cy.get('[data-cy="attendees-heading"]')
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
    it.skip('ask the user to login before they can attend', () => {
      const newUser = users.testUser;

      cy.findByRole('button', { name: 'Attend' }).click();
      cy.findByRole('heading', { name: 'Login' }).should('be.visible');
      cy.findByRole('textbox', { name: 'Email' })
        .as('email')
        .type(newUser.email);
      cy.findByRole('button', { name: 'Login' }).as('login-submit').click();
      // TODO: nicer response to un-registered users
      cy.contains('No users found');

      // TODO: should this be called 'Switch to registration'?
      cy.findByRole('button', { name: 'Register' }).click();

      cy.get('@email').should('have.value', newUser.email);
      cy.findByRole('textbox', { name: 'Name' }).type(newUser.name);

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
          const token = href
            .match(/token=3D([\s\S]*)/)[1]
            .replace(/=\s\s/g, '');
          // we don't use email to login, so this will need to be
          // updated
          cy.login(token);
          // NOTE: we can't cy.get('@login-submit').should('not.exist') here
          // because that dom element is no longer in the DOM, resolves to
          // undefined and the test fails.
          cy.contains('Are you sure you want join this?');
          cy.findByRole('button', { name: 'Confirm' }).should('be.visible');
        });
    });

    it('is possible to join using the email links', () => {
      cy.login(users.testUser.email);
      cy.visit(`/events/${eventId}?confirm_attendance=true`);

      cy.contains('You have been invited to this event');
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy="attend-success"]').should('be.visible');
      cy.findByRole('button', { name: 'Cancel' }).should('be.visible');
    });

    it('should be possible to use email link when user is initially logged out', () => {
      cy.exec(`npm run change-user -- ${users.testUser.email}`);
      cy.visit(`/events/${eventId}?confirm_attendance=true`);

      cy.contains('You have been invited to this event');
      cy.contains('Would you like to log in and attend');

      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.contains('Waiting for login');
      cy.contains('Waiting for login').should('not.exist');
      cy.get('[data-cy="attend-success"]').should('be.visible');
      cy.findByRole('button', { name: 'Cancel' }).should('be.visible');
      cy.get('[data-cy="attendees-heading"]')
        .next()
        .within(() => {
          cy.findByText(users.testUser.name).should('exist');
        });
    });

    it('should be possible to attend and cancel', () => {
      cy.login(users.testUser.email);

      cy.get('[data-cy="attendees-heading"]')
        .next()
        .as('attendees')
        .within(() => {
          cy.findByText(users.testUser.name).should('not.exist');
        });

      cy.findByRole('button', { name: 'Attend Event' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.get('@attendees').within(() => {
        cy.findByText(users.testUser.name).should('exist');
      });

      cy.findByRole('button', { name: 'Cancel' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.get('@attendees').within(() => {
        cy.findByText(users.testUser.name).should('not.exist');
      });
      cy.findByRole('button', { name: 'Cancel' }).should('not.exist');
    });

    it('should be possible to change event subscription', () => {
      cy.login(users.testUser.email);

      // Attending is required for managing event subscription
      cy.findByRole('button', { name: 'Attend Event' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.contains(/You are subscribed/);
      cy.findByRole('button', { name: 'Unsubscribe' }).click();
      cy.findByRole('alertdialog').contains('Unsubscribe from event');
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.contains('unsubscribed from');

      cy.contains(/Not subscribed/);
      cy.findByRole('button', { name: 'Subscribe' }).click();
      cy.findByRole('alertdialog').contains('Subscribe to event');
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.contains('subscribed to');
    });

    it('should reject requests from logged out users, non-members and banned users', () => {
      const attendanceVariables = { eventId, chapterId };
      const subscriptionVariables = { eventId };
      // logged out user
      cy.attendEvent(attendanceVariables, { withAuth: false }).then(
        expectToBeRejected,
      );
      cy.subscribeToEvent(subscriptionVariables, { withAuth: false }).then(
        expectToBeRejected,
      );
      cy.unsubscribeFromEvent(subscriptionVariables, { withAuth: false }).then(
        expectToBeRejected,
      );

      // newly registered user (without a chapter_users record)
      cy.login(users.testUser.email);

      cy.attendEvent(attendanceVariables).then(expectToBeRejected);
      cy.subscribeToEvent(subscriptionVariables).then(expectToBeRejected);
      cy.unsubscribeFromEvent(subscriptionVariables).then(expectToBeRejected);

      // banned user
      cy.login(users.bannedAdmin.email);

      cy.attendEvent(attendanceVariables).then(expectToBeRejected);
      cy.subscribeToEvent(subscriptionVariables).then(expectToBeRejected);
      cy.unsubscribeFromEvent(subscriptionVariables).then(expectToBeRejected);
    });

    it('should email the chapter administrator when a user attends', () => {
      cy.login(users.testUser.email);

      cy.findByRole('button', { name: 'Attend Event' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      // Two emails are send when user attends - one email to the admin, another to the Attendee.
      cy.waitUntilMail({ expectedNumberOfEmails: 2 });
      cy.mhGetMailsByRecipient(users.chapter1Admin.email).should(
        'have.length',
        1,
      );
      cy.mhGetMailsByRecipient(users.chapter1Admin.email)
        .mhFirst()
        .as('attend-mail');
      cy.get('@attend-mail')
        .mhGetSubject()
        .should('match', /^New attendee for/);
      cy.get('@attend-mail')
        .mhGetBody()
        .should('include', `User ${users.testUser.name} is attending`);
    });
  });

  describe('invite only event', () => {
    beforeEach(() => {
      cy.visit(`/events/${inviteOnlyEventId}`);
    });

    it('should be possible to request and cancel', () => {
      cy.login(users.testUser.email);

      cy.get('[data-cy="attendees-heading"]')
        .next()
        .as('attendees')
        .within(() => {
          cy.findByText(users.testUser.name).should('not.exist');
        });

      cy.findByRole('button', { name: 'Request Invite' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.contains('Event owner will soon confirm your request');
      cy.findByRole('button', { name: 'Request Invite' }).should('not.exist');

      cy.get('@attendees').within(() => {
        cy.findByText(users.testUser.name).should('not.exist');
      });

      cy.task<EventUsers>('getEventUsers', inviteOnlyEventId).then(
        (eventUsers) => {
          const requestingUser = eventUsers.find(
            ({ user: { email } }) => email === users.testUser.email,
          );
          expect(requestingUser.attendance.name === 'waitlist');
        },
      );

      cy.findByRole('button', { name: 'Cancel' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();

      cy.contains('You canceled your attendance');
      cy.findByRole('button', { name: 'Request Invite' }).should('be.visible');

      cy.task<EventUsers>('getEventUsers', inviteOnlyEventId).then(
        (eventUsers) => {
          const requestingUser = eventUsers.find(
            ({ user: { email } }) => email === users.testUser.email,
          );
          expect(requestingUser.attendance.name === 'no');
        },
      );
    });
  });
});
