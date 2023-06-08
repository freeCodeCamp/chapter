import {
  expectNoErrors,
  expectToBeRejected,
  getFirstPathParam,
} from '../../../support/util';

const chapterId = 1;

describe('chapters dashboard', () => {
  let chapterData;
  let eventData;
  let users;
  let venueData;
  before(() => {
    cy.task('seedDb');
    cy.fixture('chapters').then((fixture) => {
      chapterData = fixture[0];
    });
    cy.fixture('events').then((fixture) => {
      eventData = fixture.eventThree;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
    cy.fixture('venues').then((fixture) => {
      venueData = fixture[0];
    });
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
      .should('have.text', 'Chapters Dashboard');
  });

  it('should have a table with links to view, create and edit chapters', () => {
    cy.visit('/dashboard/chapters');
    cy.findByRole('table', { name: 'Chapters' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
    cy.get(`a[href="/dashboard/chapters/${chapterId}"]`).should('be.visible');
    cy.get('a[href="/dashboard/chapters/new"]').should('be.visible');
    cy.get(`a[href="/dashboard/chapters/${chapterId}/edit"]`).should(
      'be.visible',
    );
  });

  it('lets an instance owner create a chapter', () => {
    cy.visit('/dashboard/chapters');
    cy.get('[data-cy="new-chapter"]').click();
    cy.findByRole('textbox', { name: 'Chapter name' }).type(chapterData.name);
    cy.findByRole('textbox', { name: 'Description' }).type(
      chapterData.description,
    );
    cy.findByRole('textbox', { name: 'Tags (separated by a comma)' }).type(
      chapterData.chapter_tags,
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
    cy.location('pathname').should('match', /^\/dashboard\/chapters\/\d$/);
    cy.contains(chapterData.name);
  });

  it('lets a user create a chapter and an event in a fresh instance', () => {
    // Do NOT reset the database here, it has to keep the schema intact since
    // the db client optimizes the queries based on the schema. If the schema
    // changes the queries will fail.
    cy.exec('node server/prisma/seed/seed.js --truncate-only');
    const userEmail = 'fresh@start';
    cy.login(userEmail);
    cy.task('promoteToOwner', { email: userEmail });
    const chapterId = 1;

    cy.createChapter(chapterData).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name);
    });
    cy.createVenue({ chapterId }, venueData).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/venues/`);
      cy.contains(venueData.name);
    });
    cy.createEvent(chapterId, eventData).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/events/`);
      cy.contains(eventData.name);
    });
  });

  it('only allows owners to create chapters', () => {
    cy.task('seedDb');
    cy.login(users.chapter1Admin.email);

    cy.visit('/dashboard/chapters');
    cy.get('[data-cy="new-chapter"]').should('not.exist');

    cy.createChapter(chapterData).then(expectToBeRejected);

    // switch to owner account and try to create a chapter
    cy.login();

    cy.createChapter(chapterData).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/chapters/${response.body.data.createChapter.id}`);
      cy.contains(chapterData.name);
    });
  });

  it('chapter admin should see only admined chapters', () => {
    const adminedChapter = 1;
    cy.login(users.chapter1Admin.email);
    cy.visit('/dashboard/chapters');
    cy.get('[data-cy=chapter]').each((link) =>
      expect(getFirstPathParam(link)).to.eq(adminedChapter),
    );
  });
});
