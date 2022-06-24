describe('Users dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  it('with permission should have access to table of users', () => {
    cy.visit('/dashboard/users');
    cy.findByRole('table', { name: 'Instance Users' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'role' }).should('be.visible');
  });

  it('with permission can change user instance role', () => {
    cy.visit('/dashboard/users');

    cy.get('[data-cy=role]').then((roles) => {
      const roleNames = [...roles.map((_, role) => role.innerText)];
      const administratorToMember = roleNames.findIndex(
        (role) => role === 'administrator',
      );
      const memberToAdministrator = roleNames.findIndex(
        (role) => role === 'member',
      );

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
});
