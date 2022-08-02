import { expectToBeRejected } from '../../../../support/util';

const chapterData = {
  name: 'New Chapter Name',
  description: 'New Description',
  city: 'New City',
  region: 'New Region',
  country: 'New Country',
  category: 'New Category',
  imageUrl: 'https://example.com/new-image.jpg',
};

describe('chapter edit dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });
  it('allows admins to edit a chapter', () => {
    cy.login(Cypress.env('JWT_CHAPTER_1_ADMIN_USER'));
    cy.visit('/dashboard/chapters/1/edit');

    cy.findByRole('textbox', { name: 'Chapter name' })
      .clear()
      .type(chapterData.name);
    cy.findByRole('textbox', { name: 'Description' })
      .clear()
      .type(chapterData.description);
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
    cy.findByRole('textbox', { name: 'Image Url' })
      .clear()
      .type(chapterData.imageUrl);

    cy.findByRole('form', { name: 'Save Chapter Changes' })
      .findByRole('button', { name: 'Save Chapter Changes' })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/chapters/);
    cy.contains('New Chapter Name');
  });

  it('rejects requests from members, but allows them from owners', () => {
    // confirm the chapter is ready to be updated (i.e. doesn't not already have
    // the new name)
    const chapterId = 1;
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.contains('loading').should('not.exist');
    cy.contains(chapterData.name).should('not.exist');

    cy.register();
    cy.login(Cypress.env('JWT_TEST_USER'));

    cy.updateChapter(chapterId, chapterData).then((response) => {
      expectToBeRejected(response);

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name).should('not.exist');
    });

    cy.login();
    cy.updateChapter(chapterId, chapterData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/chapters/${chapterId}`);
      cy.contains(chapterData.name);
    });
  });
});
