import { expectToBeRejected } from '../../support/util';

const venueData = {
  name: 'Test Venue',
  street_address: '123 Main St',
  city: 'New York',
  postal_code: '10001',
  region: 'NY',
  country: 'US',
  latitude: 40.7128,
  longitude: -74.006,
};

describe('venues dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });
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

  it('lets an admin create a venue', () => {
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

    cy.login(Cypress.env('JWT_ADMIN_USER'));

    cy.visit('/dashboard/chapters/1/');
    cy.get('[data-cy=create-venue]').click();
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

  it('only accepts requests from owners and admins of the associated chapter', () => {
    const venueCreateVariables = {
      chapterId: 1,
    };
    const venueUpdateDeleteVariables = {
      chapterId: 1,
      venueId: 1,
    };

    // logged out user
    cy.logout();
    cy.reload();

    cy.createVenue(venueCreateVariables, venueData, { withAuth: false }).then(
      expectToBeRejected,
    );
    cy.updateVenue(venueUpdateDeleteVariables, venueData, {
      withAuth: false,
    }).then(expectToBeRejected);
    cy.deleteVenue(venueUpdateDeleteVariables, { withAuth: false }).then(
      expectToBeRejected,
    );

    // newly registered user (without a chapter_users record)
    cy.register();
    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.reload();

    cy.createVenue(venueCreateVariables, venueData).then(expectToBeRejected);
    cy.updateVenue(venueUpdateDeleteVariables, venueData).then(
      expectToBeRejected,
    );
    cy.deleteVenue(venueUpdateDeleteVariables).then(expectToBeRejected);

    // banned user
    cy.login(Cypress.env('JWT_BANNED_ADMIN_USER'));
    cy.reload();

    cy.createVenue(venueCreateVariables, venueData).then(expectToBeRejected);
    cy.updateVenue(venueUpdateDeleteVariables, venueData).then(
      expectToBeRejected,
    );
    cy.deleteVenue(venueUpdateDeleteVariables).then(expectToBeRejected);

    // Admin of different chapter
    cy.login(Cypress.env('JWT_ADMIN_USER'));
    cy.reload();

    cy.createVenue({ ...venueCreateVariables, chapterId: 2 }, venueData).then(
      expectToBeRejected,
    );
    cy.updateVenue({ ...venueCreateVariables, chapterId: 2 }, venueData).then(
      expectToBeRejected,
    );
    cy.deleteVenue({ ...venueCreateVariables, chapterId: 2 }).then(
      expectToBeRejected,
    );
  });
});
