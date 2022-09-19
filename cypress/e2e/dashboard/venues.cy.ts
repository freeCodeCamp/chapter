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
    cy.login();
  });
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Venues');
  });

  it('should have a table with links to view and edit venues', () => {
    cy.visit('/dashboard/venues');
    cy.findByRole('table', { name: 'Venues' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'action' }).should('be.visible');

    cy.get('[data-cy="view-venue-button"]')
      .should('be.visible')
      .first()
      .click();
    cy.get('[data-cy="view-venue-page"]').should('exist');
    cy.go('back');
    cy.get('[data-cy="edit-venue-button"]')
      .should('be.visible')
      .first()
      .click();
    cy.get('[data-cy="edit-venue-page"]').should('exist');
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

    cy.login('admin@of.chapter.one');

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
    const venueUpdateVariables = {
      chapterId: 1,
      venueId: 1,
    };

    // Create new venue, which is not used in any event
    cy.createVenue(venueCreateVariables, venueData, { withAuth: true }).then(
      (response) => {
        const venueDeleteVariables = {
          chapterId: 1,
          venueId: response.body.data.createVenue.id,
        };

        // logged out user
        cy.logout();

        cy.createVenue(venueCreateVariables, venueData, {
          withAuth: false,
        }).then(expectToBeRejected);
        cy.updateVenue(venueUpdateVariables, venueData, {
          withAuth: false,
        }).then(expectToBeRejected);
        cy.deleteVenue(venueDeleteVariables, { withAuth: false }).then(
          expectToBeRejected,
        );

        // newly registered user (without a chapter_users record)
        cy.login('test@user.org');

        cy.createVenue(venueCreateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.updateVenue(venueUpdateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.deleteVenue(venueDeleteVariables).then(expectToBeRejected);

        // banned user
        cy.login('banned@chapter.admin');

        cy.createVenue(venueCreateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.updateVenue(venueUpdateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.deleteVenue(venueDeleteVariables).then(expectToBeRejected);

        // Admin of different chapter
        cy.login('admin@of.chapter.two');

        cy.createVenue(venueCreateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.updateVenue(venueUpdateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.deleteVenue(venueDeleteVariables).then(expectToBeRejected);
      },
    );
  });

  describe('adding venue with chapter selected in form', () => {
    it('only admined chapters can be selected', () => {
      cy.login('admin@of.chapter.one');
      cy.visit('/dashboard/venues/new');
      cy.findByRole('combobox', { name: 'Chapter' })
        .find('option')
        .then((options) => {
          expect(options).to.have.length(1);
        });

      cy.login('test@user.org');
      cy.findByRole('combobox', { name: 'Chapter' })
        .find('option')
        .should('not.exist');

      cy.login();
      cy.findByRole('combobox', { name: 'Chapter' })
        .find('option')
        .then((options) => {
          expect(options).to.have.length(4);
        });
    });
  });
});
