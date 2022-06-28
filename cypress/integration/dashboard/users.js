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

      // We cannot change role of existing administrator, as that's logged in user
      // and after changing role, we will not be authorized to see users.
      const memberToOwnerToMember = roleNames.indexOf('member');
      const owner = roleNames.indexOf('owner');

      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains('member');
      cy.findByRole('combobox').select('owner');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]').eq(memberToOwnerToMember).contains('owner');
      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains('owner');
      cy.findByRole('combobox').select('member');
      cy.findByRole('button', { name: 'Change' }).click();
      cy.get('[data-cy=role]').eq(memberToOwnerToMember).contains('member');

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains('member');
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(owner).click();
      cy.findByRole('combobox').find(':selected').contains('owner');
    });
  });
});
