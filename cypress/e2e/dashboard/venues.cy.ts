import { expectToBeRejected, getFirstPathParam } from '../../support/util';

describe('venues dashboard', () => {
  let users;
  let venues;
  before(() => {
    cy.fixture('venues').then((fixture) => {
      venues = fixture;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
  });
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/venues"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Venues Dashboard');
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
    const chapterId = 1;
    const venueData = venues[1];

    cy.login(users.chapter1Admin.email);

    cy.visit(`/dashboard/chapters/${chapterId}/`);
    cy.get('[data-cy=create-venue]').click();
    cy.findByRole('textbox', { name: 'Venue name' }).type(venueData.name);
    cy.findByRole('textbox', { name: 'Tags (separated by a comma)' }).type(
      venueData.venue_tags,
    );
    cy.findByRole('textbox', { name: 'Street address' }).type(
      venueData.street_address,
    );
    cy.findByRole('textbox', { name: 'City' }).type(venueData.city);
    cy.findByRole('textbox', { name: 'Postal Code' }).type(
      venueData.postal_code,
    );
    cy.findByRole('textbox', { name: 'Region' }).type(venueData.region);
    cy.findByRole('textbox', { name: 'Country' }).type(venueData.country);
    cy.findByRole('spinbutton', { name: 'Latitude' }).type(venueData.latitude);
    cy.findByRole('spinbutton', { name: 'Longitude' }).type(
      venueData.longitude,
    );

    cy.findByRole('form', { name: 'Add venue' })
      .findByRole('button', {
        name: 'Add venue',
      })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/venues\/\d+$/);

    // confirm that the test data appears in the new venue
    cy.contains(venueData.name);
    cy.contains(venueData.city);
    cy.contains(venueData.postal_code);
    cy.contains(venueData.region);
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
    const venueData = venues[0];

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
        cy.login(users.testUser.email);

        cy.createVenue(venueCreateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.updateVenue(venueUpdateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.deleteVenue(venueDeleteVariables).then(expectToBeRejected);

        // banned user
        cy.login(users.bannedAdmin.email);

        cy.createVenue(venueCreateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.updateVenue(venueUpdateVariables, venueData).then(
          expectToBeRejected,
        );
        cy.deleteVenue(venueDeleteVariables).then(expectToBeRejected);

        // Admin of different chapter
        cy.login(users.chapter2Admin.email);

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

  it('chapter admin should see only venues from admined chapters', () => {
    cy.login(users.chapter1Admin.email);
    const chapterId = 1;
    cy.visit('/dashboard/venues');
    cy.getChapterVenues(chapterId).then((venues) => {
      const venueIds = venues.map(({ id }) => id);
      cy.get('[data-cy=view-venue-button]').each((link) =>
        expect(venueIds).to.include(getFirstPathParam(link)),
      );
    });
  });

  describe('adding venue with chapter selected in form', () => {
    it('only admined chapters can be selected', () => {
      cy.login(users.chapter1Admin.email);
      cy.visit('/dashboard/venues/new');
      cy.findByRole('combobox', { name: 'Chapter' })
        .find('option')
        .then((options) => {
          expect(options).to.have.length(1);
        });

      cy.login(users.testUser.email);
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
