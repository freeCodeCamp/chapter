describe('chapters dashboard', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });

  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/chapters"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Chapters');
  });

  it('should have a table with links to view, create and edit chapters', () => {
    cy.visit('/dashboard/chapters');
    cy.findByRole('table', { name: 'Chapters' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
    cy.get('a[href="/dashboard/chapters/1"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters/new"]').should('be.visible');
    cy.get('a[href="/dashboard/chapters/1/edit"]').should('be.visible');
  });

  it('lets an instance owner create a chapter', () => {
    const fix = {
      name: 'Name goes here',
      description: 'Summary of the chapter',
      city: 'City it is based in',
      region: 'Location in the world',
      country: 'Home country',
      category: 'Type of chapter',
      imageUrl: 'https://example.com/image.jpg',
    };
    cy.login();
    cy.visit('/dashboard/chapters');
    cy.get('[data-cy="new-chapter"]').click();
    cy.findByRole('textbox', { name: 'Chapter name' }).type(fix.name);
    cy.findByRole('textbox', { name: 'Description' }).type(fix.description);
    cy.findByRole('textbox', { name: 'City' }).type(fix.city);
    cy.findByRole('textbox', { name: 'Region' }).type(fix.region);
    cy.findByRole('textbox', { name: 'Country' }).type(fix.country);
    cy.findByRole('textbox', { name: 'Category' }).type(fix.category);
    cy.findByRole('textbox', { name: 'Image Url' }).type(fix.imageUrl);

    cy.findByRole('form', { name: 'Add chapter' })
      .findByRole('button', {
        name: 'Add chapter',
      })
      .click();
    // TODO: this should mirror events. i.e. either both should go to the list
    // or both should go to the newly created page
    cy.location('pathname').should('match', /^\/dashboard\/chapters$/);
    // TODO: if go to /dashboard/chapters/<n>/edit, look for the rest of the
    // data

    // confirm that the test data appears in the new chapter
    cy.contains(fix.name);
  });
});
