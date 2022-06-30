describe('chapter edit dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });
  it('allows admins to edit a chapter', () => {
    cy.login(Cypress.env('JWT_ADMIN_USER'));
    cy.visit('/dashboard/chapters/1/edit');

    const inputs = [
      { name: 'Chapter name', value: 'New Chapter Name' },
      { name: 'Description', value: 'New Description' },
      { name: 'City', value: 'New City' },
      { name: 'Region', value: 'New Region' },
      { name: 'Country', value: 'New Country' },
      { name: 'Category', value: 'New Category' },
      { name: 'Image Url', value: 'https://example.com/image.jpg' },
    ];
    cy.wrap(inputs).each(({ name, value }) => {
      cy.findByRole('textbox', { name }).clear().type(value);
    });
    cy.findByRole('form', { name: 'Save Chapter Changes' })
      .findByRole('button', { name: 'Save Chapter Changes' })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/chapters/);
    cy.contains('New Chapter Name');
  });
});
