import { expectToBeRejected } from '../../../support/util';

const chapterData = {
  name: 'Name goes here',
  description: 'Summary of the chapter',
  city: 'City it is based in',
  region: 'Location in the world',
  country: 'Home country',
  tag: 'Chapter Tag',
  category: 'Type of chapter',
  imageUrl: 'https://example.com/image.jpg',
};

describe('chapters dashboard', () => {
  before(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('not.exist');
    cy.get('a[href="/dashboard/chapters"]').click();
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
    cy.findByRole('textbox', { name: 'Tag Name' }).type(chapterData.tag);
    cy.findByRole('textbox', { name: 'Image Url' }).type(chapterData.imageUrl);

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
    cy.contains(chapterData.name);
  });

  it('only allows owners to create chapters', () => {
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
