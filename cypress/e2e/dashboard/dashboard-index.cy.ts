describe('dashboard', () => {
  let users;
  before(() => {
    cy.task('seedDb');
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
    cy.visit('/dashboard');
  });

  it('instance owner should have links to all the dashboard', () => {
    cy.login();
    cy.get('a[href="/dashboard/events"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters"]').should('be.visible');
    cy.get('a[href="/dashboard/venues"]').should('be.visible');
    cy.get('a[href="/dashboard/users"]').should('be.visible');
    cy.get('a[href="/dashboard/sponsors"]').should('be.visible');
  });

  it('chapter administrator should have links to the dashboards allowed for chapter administrator', () => {
    cy.login(users.chapter1Admin.email);
    cy.get('a[href="/dashboard/events"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters"]').should('be.visible');
    cy.get('a[href="/dashboard/venues"]').should('be.visible');
    cy.get('a[href="/dashboard/sponsors"]').should('be.visible');

    cy.get('a[href="/dashboard/users"]').should('not.exist');
  });

  it(`member shouldn't have links to the dashboards`, () => {
    cy.login(users.testUser.email);
    cy.get('a[href="/dashboard/events"]').should('not.exist');
    cy.get('a[href="/dashboard/chapters"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').should('not.exist');
    cy.get('a[href="/dashboard/sponsors"]').should('not.exist');
    cy.get('a[href="/dashboard/users"]').should('not.exist');
  });
});
