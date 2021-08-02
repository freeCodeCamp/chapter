describe('venues dashboard', () => {
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Venues');
  });

  it('should have links to view, create and edit venues', () => {
    cy.visit('/dashboard/venues');
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
    cy.findByRole('textbox', { name: 'name' }).type(fix.name);
    cy.findByRole('textbox', { name: 'street_address' }).type(
      fix.streetAddress,
    );
    cy.findByRole('textbox', { name: 'city' }).type(fix.city);
    cy.findByRole('textbox', { name: 'postal_code' }).type(fix.postalCode);
    cy.findByRole('textbox', { name: 'region' }).type(fix.region);
    cy.findByRole('textbox', { name: 'country' }).type(fix.country);
    cy.findByRole('spinbutton', { name: 'latitude' }).type(fix.latitude);
    cy.findByRole('spinbutton', { name: 'longitude' }).type(fix.longitude);

    cy.findByRole('form', { name: 'Add venue' }).submit();
    // TODO: this should mirror events. i.e. either both should go to the list
    // or both should go to the newly created page
    cy.location('pathname').should('match', /^\/dashboard\/venues/);
    // TODO: if it goes to /dashboard/venues/<n>/edit, look for the rest of the
    // data

    // confirm that the test data appears in the new venue
    cy.contains(fix.name);
  });
});
