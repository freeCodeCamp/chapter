import { expectNoErrors, expectToBeRejected } from '../../../../support/util';

const chapterId = 1;

describe('chapter edit dashboard', () => {
  let chapterData;
  let users;
  before(() => {
    cy.fixture('chapters').then((fixture) => {
      chapterData = fixture[1];
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
  });
  it('allows admins to edit a chapter', () => {
    cy.login(users.chapter1Admin.email);
    cy.visit(`/dashboard/chapters/${chapterId}/edit`);

    cy.findByRole('textbox', { name: 'Chapter name' })
      .clear()
      .type(chapterData.name);
    cy.findByRole('textbox', { name: 'Description' })
      .clear()
      .type(chapterData.description);
    cy.findByRole('textbox', { name: 'Tags (separated by a comma)' })
      .clear()
      .type(chapterData.chapter_tags);
    cy.findByRole('textbox', { name: 'City' }).clear().type(chapterData.city);
    cy.findByRole('textbox', { name: 'Region' })
      .clear()
      .type(chapterData.region);
    cy.findByRole('textbox', { name: 'Country' })
      .clear()
      .type(chapterData.country);
    cy.findByRole('textbox', { name: 'Category' })
      .clear()
      .type(chapterData.category);
    cy.findByRole('textbox', { name: 'Banner Url' })
      .clear()
      .type(chapterData.banner_url);
    cy.findByRole('textbox', { name: 'Logo Url' })
      .clear()
      .type(chapterData.logo_url);

    cy.findByRole('form', { name: 'Save Chapter Changes' })
      .findByRole('button', { name: 'Save Chapter Changes' })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/chapters/);
    cy.contains('New Chapter Name');
  });

  it('rejects requests from members, but allows them from owners', () => {
    // confirm the chapter is ready to be updated (i.e. doesn't not already have
    // the new name)
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.contains('loading').should('not.exist');
    cy.contains(chapterData.name).should('not.exist');

    cy.login(users.testUser.email);

    cy.updateChapter(chapterId, chapterData).then((response) => {
      expectToBeRejected(response);

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name).should('not.exist');
    });

    // back to owner
    cy.login();
    cy.updateChapter(chapterId, chapterData).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name);
    });
  });

  it('only accepts chapter deletion requests from owners', () => {
    cy.login(users.chapter1Admin.email);

    cy.deleteChapter(chapterId).then((response) => {
      expectToBeRejected(response);
    });

    cy.login();
    cy.deleteChapter(chapterId).then(expectNoErrors);
  });
});
