describe('chapters dashboard', () => {
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

  it('lets a user create a chapter', () => {
    const fix = {
      name: 'Name goes here',
      description: 'Summary of the chapter',
      details: 'Paragraph going into more depth',
      city: 'City it is based in',
      region: 'Location in the world',
      country: 'Home country',
      category: 'Type of chapter',
      imageUrl: 'https://example.com/image.jpg',
    };
    cy.visit('/dashboard/chapters');
    cy.get('a[href="/dashboard/chapters/new"]').click();
    cy.findByRole('textbox', { name: 'name' }).type(fix.name);
    cy.findByRole('textbox', { name: 'description' }).type(fix.description);
    cy.findByRole('textbox', { name: 'details' }).type(fix.details);
    cy.findByRole('textbox', { name: 'city' }).type(fix.city);
    cy.findByRole('textbox', { name: 'region' }).type(fix.region);
    cy.findByRole('textbox', { name: 'country' }).type(fix.country);
    cy.findByRole('textbox', { name: 'category' }).type(fix.category);
    cy.findByRole('textbox', { name: 'imageUrl' }).type(fix.imageUrl);

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
