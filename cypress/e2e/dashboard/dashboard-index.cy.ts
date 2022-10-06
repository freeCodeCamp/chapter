describe('dashboard', () => {
  before(() => {
    cy.task('seedDb');
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
    cy.login('admin@of.chapter.one');
    cy.get('a[href="/dashboard/events"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters"]').should('be.visible');
    cy.get('a[href="/dashboard/venues"]').should('be.visible');
    cy.get('a[href="/dashboard/sponsors"]').should('be.visible');

    cy.get('a[href="/dashboard/users"]').should('not.exist');
  });

  it('member should have links to the dashboards allowed for member', () => {
    cy.login('test@user.org');
    cy.get('a[href="/dashboard/events"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters"]').should('be.visible');
    cy.get('a[href="/dashboard/venues"]').should('be.visible');

    cy.get('a[href="/dashboard/sponsors"]').should('not.exist');
    cy.get('a[href="/dashboard/users"]').should('not.exist');
  });
});
