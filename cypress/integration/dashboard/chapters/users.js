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
      const administratorToMember = roleNames.indexOf('administrator');
      const memberToAdministrator = roleNames.indexOf('member');

      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains('member');
      cy.findByRole('combobox').select('administrator');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]')
        .eq(memberToAdministrator)
        .contains('administrator');

      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains('administrator');
      cy.findByRole('combobox').select('member');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]').eq(administratorToMember).contains('member');

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToAdministrator).click();
      cy.findByRole('combobox').find(':selected').contains('administrator');
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(administratorToMember).click();
      cy.findByRole('combobox').find(':selected').contains('member');
    });
  });

  it('administrator can ban user from chapter', () => {
    cy.visit('/dashboard/chapters/1/users');

    cy.findAllByRole('row').as('rows');

    cy.get('@rows')
      .filter(':contains("administrator")')
      .find('[data-cy=isBanned]')
      .should('not.exist');

    cy.get('@rows').filter(':contains("member")').as('members');
    cy.get('@members').find('[data-cy=isBanned]');

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
