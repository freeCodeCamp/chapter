describe('event dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  describe('users lists', () => {
    it('confirming user on waitlist should move user to RSVPs', () => {
      cy.visit('/dashboard/events/1');
      cy.contains(/Waitlist/);
      cy.findAllByRole('row')
        .filter(':contains("Confirm")')
        .first()
        .as('waitlistRow');
      cy.get('@waitlistRow').find('td').first().invoke('text').as('userName');
      cy.get('@waitlistRow')
        .contains(/Confirm/)
        .click();
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Confirm' })
        .click();

      cy.get('@userName').then((userName) => {
        cy.get('@waitlistRow').not(`:contains(${userName})`);
        cy.findAllByRole('row')
          .filter(`:contains(${userName})`)
          .first()
          .as('userRow');
        cy.get('@userRow').not(':contains("Confirm")');
        cy.get('@userRow').contains(/Kick/);
      });
    });

    it('kicking user should remove user from event', () => {
      cy.visit('/dashboard/events/1');
      cy.contains(/RSVPs/);
      cy.findAllByRole('row').filter(':contains("Kick")').first().as('rsvpRow');
      cy.get('@rsvpRow').find('td').first().invoke('text').as('userName');
      cy.get('@rsvpRow').contains(/Kick/).click();
      cy.findByRole('button', { name: 'Delete' }).click();

      cy.get('@userName').then((userName) => {
        cy.contains(userName).should('not.exist');
      });
    });

    it('canceling confirming user on waitlist should not move user to RSVPs', () => {
      cy.visit('/dashboard/events/1');
      cy.contains(/Waitlist/);
      cy.findAllByRole('row')
        .filter(':contains("Confirm")')
        .first()
        .as('waitlistRow');
      cy.get('@waitlistRow').find('td').first().invoke('text').as('userName');
      cy.get('@waitlistRow')
        .contains(/Confirm/)
        .click();
      cy.intercept('/graphql', cy.spy().as('request'));
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@request').should('not.have.been.called');

      cy.get('@userName').then((userName) => {
        cy.get('@waitlistRow').contains(userName);
      });
    });

    it('canceling kicking user should not remove user from event', () => {
      cy.visit('/dashboard/events/1');
      cy.contains(/Waitlist/);
      cy.findAllByRole('row').filter(':contains("Kick")').first().as('rsvpRow');
      cy.get('@rsvpRow').find('td').first().invoke('text').as('userName');
      cy.get('@rsvpRow').contains(/Kick/).click();
      cy.intercept('/graphql', cy.spy().as('request'));
      cy.findByRole('alertdialog')
        .findByRole('button', { name: 'Cancel' })
        .click();

      cy.get('@request').should('not.have.been.called');

      cy.get('@userName').then((userName) => {
        cy.contains(userName);
        cy.get('@rsvpRow').contains(userName);
      });
    });
  });
});
