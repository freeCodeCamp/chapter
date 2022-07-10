import { expectToBeRejected } from '../../../support/util';

describe('event dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  describe('users lists', () => {
    it('confirming user on waitlist should move user to RSVPs and send email', () => {
      cy.visit('/dashboard/events/1');
      cy.get('[data-cy=waitlist]').as('waitlist');
      cy.get('@waitlist')
        .find('[data-cy=username]')
        .first()
        .invoke('text')
        .as('userName');

      cy.get('@waitlist').find('[data-cy=confirm]').first().click();
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Confirm' })
        .click();

      cy.waitUntilMail('allMail');
      cy.get('@allMail').mhFirst().as('email');

      cy.get('@userName').then((userName) => {
        cy.get('@waitlist').not(`:contains(${userName})`);
        cy.get('[data-cy=rsvps]').contains(userName);
      });

      cy.get('@email')
        .mhGetSubject()
        .should('include', 'Your RSVP is confirmed');
      cy.get('@email')
        .mhGetBody()
        .should('include', 'reservation is confirmed');
      cy.getEventUsers(1).then((eventUsers) => {
        cy.get('@userName').then((userName) => {
          const userEmail = eventUsers
            .filter(({ user: { name } }) => name === userName)
            .map(({ user: { email } }) => email);
          cy.get('@email').mhGetRecipients().should('have.members', userEmail);
        });
      });
    });

    it('kicking user should remove user from event', () => {
      cy.visit('/dashboard/events/1');
      cy.get('[data-cy=rsvps]').as('rsvps');
      cy.get('@rsvps')
        .find('[data-cy=username]')
        .first()
        .invoke('text')
        .as('userName');

      cy.get('@rsvps').find('[data-cy=kick]').first().click();
      cy.findByRole('button', { name: 'Delete' }).click();

      cy.get('@userName').then((userName) => {
        cy.contains(userName).should('not.exist');
      });
    });

    it('canceling confirming user on waitlist should not move user to RSVPs', () => {
      cy.visit('/dashboard/events/1');
      cy.get('[data-cy=waitlist]').as('waitlist');
      cy.get('@waitlist')
        .find('[data-cy=username]')
        .first()
        .invoke('text')
        .as('userName');

      cy.get('@waitlist').find('[data-cy=confirm]').first().click();

      cy.intercept('http://localhost:5000/graphql', (req) => {
        expect(req.body?.operationName?.includes('confirmRsvp')).to.be.false;
      });
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@userName').then((userName) => {
        cy.get('@waitlist').contains(userName);
      });
    });

    it('canceling kicking user should not remove user from event', () => {
      cy.visit('/dashboard/events/1');
      cy.get('[data-cy=rsvps]').as('rsvps');
      cy.get('@rsvps')
        .find('[data-cy=username]')
        .first()
        .invoke('text')
        .as('userName');

      cy.get('@rsvps').find('[data-cy=kick]').first().click();
      cy.intercept('/graphql', cy.spy().as('request'));
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@request').should('not.have.been.called');
      cy.get('@userName').then((userName) => {
        cy.get('@rsvps').contains(userName);
      });
    });

    it('prevents members from confirming or kicking users', () => {
      const eventId = 1;

      // Starting as the instance owner to ensure we can find the RSVPs
      cy.getEventUsers(eventId).then((eventUsers) => {
        const confirmedUser = eventUsers.find(
          ({ rsvp: { name } }) => name === 'yes',
        ).user;
        const waitlistUser = eventUsers.find(
          ({ rsvp: { name } }) => name === 'waitlist',
        ).user;

        // Switch to new member before trying to confirm and kick
        cy.register();
        cy.login(Cypress.env('JWT_TEST_USER'));

        cy.deleteRsvp(eventId, confirmedUser.id).then(expectToBeRejected);
        cy.confirmRsvp(eventId, waitlistUser.id).then(expectToBeRejected);
      });
    });
  });
});
