describe('Chapter Users dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });
  it('should have a table of users', () => {
    cy.visit('/dashboard/chapters/1/users');
    cy.findByRole('table', { name: 'Chapter Users' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'email' }).should('be.visible');
  });

  it('should not be possible to create users', () => {
    cy.visit('/dashboard/chapters/1/users/new', { failOnStatusCode: false });
    cy.contains('This page could not be found');
  });

  it('can change user chapter role', () => {
    cy.visit('/dashboard/chapters/1/users');

    cy.get('[data-cy=role]').then((roles) => {
      const roleNames = [...roles.map((_, role) => role.innerText)];
      const organizerToMember = roleNames.findIndex(
        (role) => role === 'organizer',
      );
      const memberToOrganizer = roleNames.findIndex(
        (role) => role === 'member',
      );

      cy.get('[data-cy=changeRole]').eq(memberToOrganizer).click();
      cy.findByRole('combobox').find(':selected').contains('member');
      cy.findByRole('combobox').select('organizer');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]').eq(memberToOrganizer).contains('organizer');

      cy.get('[data-cy=changeRole]').eq(organizerToMember).click();
      cy.findByRole('combobox').find(':selected').contains('organizer');
      cy.findByRole('combobox').select('member');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]').eq(organizerToMember).contains('member');

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToOrganizer).click();
      cy.findByRole('combobox').find(':selected').contains('organizer');
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(organizerToMember).click();
      cy.findByRole('combobox').find(':selected').contains('member');
    });
  });

  it('organizer can ban user from chapter', () => {
    cy.visit('/dashboard/chapters/1/users');

    cy.findAllByRole('row').as('rows');

    cy.get('@rows')
      .filter(':contains("organizer")')
      .contains('ban', { matchCase: false })
      .should('not.exist');

    cy.get('@rows').filter(':contains("member")').as('members');
    cy.get('@members').should('contain', 'ban', { matchCase: false });

    cy.get('@members')
      .not(':contains("Unban")')
      .not(':contains("Banned")')
      .first()
      .as('userToBan');
    cy.get('@userToBan').find('[data-cy=isBanned]').should('not.exist');

    cy.get('@userToBan').findByRole('button', { name: 'Ban' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was banned', { matchCase: false });
    cy.get('@userToBan').find('[data-cy=isBanned]').should('exist');
    cy.get('@userToBan')
      .findByRole('button', { name: 'Unban' })
      .should('exist');
    cy.get('@userToBan')
      .findByRole('button', { name: 'Ban' })
      .should('not.exist');

    cy.get('@userToBan').findByRole('button', { name: 'Unban' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.contains('was unbanned', { matchCase: false });
    cy.get('@userToBan').find('[data-cy=isBanned]').should('not.exist');
    cy.get('@userToBan').findByRole('button', { name: 'Ban' }).should('exist');
    cy.get('@userToBan')
      .findByRole('button', { name: 'Unban' })
      .should('not.exist');
  });
});
