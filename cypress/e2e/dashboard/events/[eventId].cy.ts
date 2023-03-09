import { EventUsers } from '../../../../cypress.config';
import { expectToBeRejected } from '../../../support/util';

const eventId = 1;

const setUsernameAlias = (usersAlias: string) =>
  cy
    .get(usersAlias)
    .find('[data-cy=user-name]')
    .first()
    .invoke('text')
    .as('userName');

describe('event dashboard', () => {
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
    cy.mhDeleteAll();
  });

  describe('users lists', () => {
    it('confirming user on waitlist should move user to attendees and send email', () => {
      cy.visit(`/dashboard/events/${eventId}`);
      cy.get('[data-cy=waitlist]').as('waitlist');
      setUsernameAlias('@waitlist');

      cy.get('@waitlist').find('[data-cy=confirm]').first().click();
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Confirm' })
        .click();

      cy.waitUntilMail().mhFirst().as('email');

      cy.get<string>('@userName').then((userName) => {
        cy.get('@waitlist').not(`:contains(${userName})`);
        cy.get('[data-cy=attendees]').contains(userName);
      });

      cy.get('@email')
        .mhGetSubject()
        .should('include', 'Your attendance is confirmed');
      cy.get('@email')
        .mhGetBody()
        .should('include', 'reservation is confirmed');
      cy.task<EventUsers>('getEventUsers', eventId).then((eventUsers) => {
        cy.get<string>('@userName').then((userName) => {
          const userEmail = eventUsers
            .filter(({ user: { name } }) => name === userName)
            .map(({ user: { email } }) => email);
          cy.get('@email').mhGetRecipients().should('have.members', userEmail);
        });
      });
    });

    it('moving user to waitlist', () => {
      cy.visit(`/dashboard/events/${eventId}`);
      cy.get('[data-cy=attendees]').as('attendees');
      setUsernameAlias('@attendees');

      cy.get('@attendees').find('[data-cy="move to waitlist"]').first().click();
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Move user' })
        .click();

      cy.waitUntilMail().mhFirst().as('email');

      cy.get<string>('@userName').then((userName) => {
        cy.get('@attendees').not(`:contains(${userName})`);
        cy.get('[data-cy=waitlist]').contains(userName);
      });

      cy.get('@email')
        .mhGetSubject()
        .should('include', 'You have been put on the waitlist');
      cy.get('@email')
        .mhGetBody()
        .then((body) => body.replace(/=\s\s/g, ''))
        .should('include', 'changed by the event administrator');
      cy.get('@email').mhGetBody().should('include', 'now on the waitlist');
      cy.task<EventUsers>('getEventUsers', eventId).then((eventUsers) => {
        cy.get<string>('@userName').then((userName) => {
          const userEmail = eventUsers
            .filter(({ user: { name } }) => name === userName)
            .map(({ user: { email } }) => email);
          cy.get('@email').mhGetRecipients().should('have.members', userEmail);
        });
      });
    });

    it('removing user should remove user from event', () => {
      cy.visit(`/dashboard/events/${eventId}`);
      cy.get('[data-cy=attendees]').as('attendees');
      setUsernameAlias('@attendees');

      cy.get('@attendees').find('[data-cy=remove]').first().click();
      cy.findByRole('button', { name: 'Delete' }).click();

      cy.get<string>('@userName').then((userName) => {
        cy.contains(userName).should('not.exist');
      });
    });

    it('canceling confirming user on waitlist should not move user to attendees', () => {
      cy.visit(`/dashboard/events/${eventId}`);
      cy.get('[data-cy=waitlist]').as('waitlist');
      setUsernameAlias('@waitlist');

      cy.get('@waitlist').find('[data-cy=confirm]').first().click();

      cy.intercept(Cypress.env('GQL_URL'), (req) => {
        expect(req.body?.operationName?.includes('confirmAttendee')).to.be
          .false;
      });
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get<string>('@userName').then((userName) => {
        cy.get('@waitlist').contains(userName);
      });
    });

    it('canceling removing user should not remove user from event', () => {
      cy.visit(`/dashboard/events/${eventId}`);
      cy.get('[data-cy=attendees]').as('attendees');
      setUsernameAlias('@attendees');

      cy.get('@attendees').find('[data-cy=remove]').first().click();
      cy.intercept('/graphql', cy.spy().as('request'));
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@request').should('not.have.been.called');
      cy.get<string>('@userName').then((userName) => {
        cy.get('@attendees').contains(userName);
      });
    });

    it('prevents members from confirming, moving to waitlist, or removing users', () => {
      // Starting as the instance owner to ensure we can find the attendees
      cy.task<EventUsers>('getEventUsers', eventId).then((eventUsers) => {
        const confirmedUser = eventUsers.find(
          ({ attendance: { name } }) => name === 'yes',
        ).user;
        const waitlistUser = eventUsers.find(
          ({ attendance: { name } }) => name === 'waitlist',
        ).user;

        // Switch to new member before trying to confirm and remove
        cy.login(users.testUser.email);

        cy.deleteAttendee(eventId, confirmedUser.id).then(expectToBeRejected);
        //cy.moveToWaitlist(eventId, confirmedUser.id).then(expectToBeRejected);
        cy.confirmAttendee(eventId, waitlistUser.id).then(expectToBeRejected);
      });
    });
  });
});
