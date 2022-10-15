import { expectToBeRejected } from '../../../support/util';

const chapterData = {
  name: 'Name goes here',
  description: 'Summary of the chapter',
  city: 'City it is based in',
  region: 'Location in the world',
  country: 'Home country',
  category: 'Type of chapter',
  logo_url: 'https://example.com/image.jpg',
  banner_url: 'https://example.com/image.jpg',
};

// TODO: move this and other fixtures to a common file
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

const eventData = {
  venue_id: 1,
  sponsor_ids: [],
  name: 'Other Event',
  description: 'Test Description',
  url: 'https://test.event.org',
  venue_type: 'PhysicalAndOnline',
  capacity: 10,
  image_url: 'https://test.event.org/image',
  streaming_url: 'https://test.event.org/video',
  start_at: '2022-01-01T00:01',
  ends_at: '2022-01-02T00:02',
  invite_only: false,
};

describe('chapters dashboard', () => {
  before(() => {
    cy.task('seedDb');
  });
  beforeEach(() => {
    cy.login();
  });

  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('[data-cy="dashboard-tabs"]')
      .find('a[href="/dashboard/chapters"]')
      .click();
    cy.get('[data-cy="chapter-dash-heading"]').should('be.visible');
    cy.get('[data-cy="dashboard-tabs"]')
      .find('a[aria-current="page"]')
      .should('have.text', 'Chapters');
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
    cy.visit('/dashboard/chapters');
    cy.get('[data-cy="new-chapter"]').click();
    cy.findByRole('textbox', { name: 'Chapter name' }).type(chapterData.name);
    cy.findByRole('textbox', { name: 'Description' }).type(
      chapterData.description,
    );
    cy.findByRole('textbox', { name: 'City' }).type(chapterData.city);
    cy.findByRole('textbox', { name: 'Region' }).type(chapterData.region);
    cy.findByRole('textbox', { name: 'Country' }).type(chapterData.country);
    cy.findByRole('textbox', { name: 'Category' }).type(chapterData.category);
    cy.findByRole('textbox', { name: 'Logo Url' }).type(chapterData.logo_url);
    cy.findByRole('textbox', { name: 'Banner Url' }).type(
      chapterData.banner_url,
    );

    cy.findByRole('form', { name: 'Add chapter' })
      .findByRole('button', {
        name: 'Add chapter',
      })
      .click();
    cy.location('pathname').should(
      'match',
      /^\/dashboard\/chapters\/\d\/new-venue$/,
    );
    cy.contains(chapterData.name);
  });

  it('lets a user create a chapter and an event in a fresh instance', () => {
    cy.exec('npm run db:init');
    const userEmail = 'fresh@start';
    cy.login(userEmail);
    cy.task('promoteToOwner', { email: userEmail });
    const chapterId = 1;

    cy.createChapter(chapterData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name);
    });
    cy.createVenue({ chapterId }, venueData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/venues/`);
      cy.contains(venueData.name);
    });
    cy.createEvent(chapterId, eventData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/events/`);
      cy.contains(eventData.name);
    });
  });

  it('only allows owners to create chapters', () => {
    cy.task('seedDb');
    cy.login('admin@of.chapter.one');

    cy.visit('/dashboard/chapters');
    cy.get('[data-cy="new-chapter"]').should('not.exist');

    cy.createChapter(chapterData).then(expectToBeRejected);

    // switch to owner account and try to create a chapter
    cy.login();

    cy.createChapter(chapterData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/chapters/${response.body.data.createChapter.id}`);
      cy.contains(chapterData.name);
    });
  });
});
