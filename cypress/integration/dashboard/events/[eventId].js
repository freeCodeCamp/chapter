describe('event dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  describe('users lists', () => {
    it('confirming user on waitlist should move user to RSVPs', () => {
      cy.visit('/dashboard/events/1');
      cy.get('[data-cy=waitlist]').as('waitlist');
      cy.get('@waitlist')
        .find('[data-cy=username]')
        .first()
        .invoke('text')
        .as('userName');

      cy.get('@waitlist').find('[data-cy=confirmRSVP]').first().click();
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Confirm' })
        .click();

      cy.get('@userName').then((userName) => {
        cy.get('@waitlist').not(`:contains(${userName})`);
        cy.get('[data-cy=rsvps]').contains(userName);
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

      cy.get('@waitlist').find('[data-cy=confirmRSVP]').first().click();

      cy.intercept('/graphql', cy.spy().as('request'));
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@request').should('not.have.been.called');
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
  });
});
