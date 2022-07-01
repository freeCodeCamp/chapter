describe('venues dashboard', () => {
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Venues');
  });

  it('should have a table with links to view, create and edit venues', () => {
    cy.visit('/dashboard/venues');
    cy.findByRole('table', { name: 'Venues' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
    cy.get('a[href="/dashboard/venues/1"]').should('be.visible');
    cy.get('a[href="/dashboard/venues/new"]').should('be.visible');
    cy.get('a[href="/dashboard/venues/1/edit"]').should('be.visible');
  });

  it('lets a user create a venue', () => {
    const fix = {
      name: 'Name goes here',
      streetAddress: '10 Random Path',
      city: 'City it is based in',
      postalCode: '2000',
      region: 'Location in the world',
      country: 'Some country',
      latitude: '-45',
      longitude: '35',
    };
    cy.visit('/dashboard/venues');
    cy.get('a[href="/dashboard/venues/new"]').click();
    cy.findByRole('textbox', { name: 'Venue name' }).type(fix.name);
    cy.findByRole('textbox', { name: 'Street address' }).type(
      fix.streetAddress,
    );
    cy.findByRole('textbox', { name: 'City' }).type(fix.city);
    cy.findByRole('textbox', { name: 'Postal Code' }).type(fix.postalCode);
    cy.findByRole('textbox', { name: 'Region' }).type(fix.region);
    cy.findByRole('textbox', { name: 'Country' }).type(fix.country);
    cy.findByRole('spinbutton', { name: 'Latitude' }).type(fix.latitude);
    cy.findByRole('spinbutton', { name: 'Longitude' }).type(fix.longitude);

    cy.findByRole('form', { name: 'Add venue' })
      .findByRole('button', {
        name: 'Add venue',
      })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/venues\/\d+$/);

    // confirm that the test data appears in the new venue
    cy.contains(fix.name);
    cy.contains(fix.city);
    cy.contains(fix.postalCode);
    cy.contains(fix.region);
    // TODO: display more details about the venue?
  });
});
