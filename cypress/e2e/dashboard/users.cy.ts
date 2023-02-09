describe('Users dashboard', () => {
  let instanceRoles;
  before(() => {
    cy.fixture('instanceRoles').then((fixture) => {
      instanceRoles = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
    cy.mhDeleteAll();
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
      const memberRole = instanceRoles.MEMBER;
      const ownerRole = instanceRoles.OWNER;
      const roleNames = [...roles.map((_, role) => role.innerText)];

      // We cannot change role of existing owner, as that's logged in user
      // and after changing role, we will no longer be authorized to see users.
      const memberToOwnerToMember = roleNames.indexOf(memberRole);
      const owner = roleNames.indexOf(ownerRole);

      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains(memberRole);
      cy.findByRole('combobox').select(ownerRole);
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]').eq(memberToOwnerToMember).contains(ownerRole);
      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains(ownerRole);
      cy.findByRole('combobox').select(memberRole);
      cy.findByRole('button', { name: 'Change' }).click();
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy=role]').eq(memberToOwnerToMember).contains(memberRole);

      cy.get('[data-cy="user-name"]')
        .eq(memberToOwnerToMember)
        .invoke('text')
        .as('userName');
      cy.waitUntilMail().mhFirst().as('email');

      cy.get('@email')
        .mhGetSubject()
        .should('include', `Instance role changed`);
      cy.get('@userName').then((userName) => {
        cy.get('@email')
          .mhGetBody()
          .should('include', `Hello, ${userName}.<br />`)
          .should(
            'include',
            `Your instance role has been changed to ${memberRole}.`,
          );
      });

      // Ensure default value is changed
      cy.get('[data-cy=changeRole]').eq(memberToOwnerToMember).click();
      cy.findByRole('combobox').find(':selected').contains(memberRole);
      cy.get('[aria-label=Close]').click();
      cy.get('[data-cy=changeRole]').eq(owner).click();
      cy.findByRole('combobox').find(':selected').contains(ownerRole);
    });
  });
});
