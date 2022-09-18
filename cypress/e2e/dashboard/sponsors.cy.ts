import { expectToBeRejected } from '../../support/util';

const testSponsor = {
  name: 'Test Sponsor',
  website: 'http://example.com',
  logo_path: 'logo.png',
  type: 'OTHER',
};

describe('sponsors dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
  });

  it('lets an instance owner create sponsors', () => {
    cy.visit('/dashboard/sponsors/new');

    cy.findByRole('textbox', { name: 'Sponsor Name' }).type(testSponsor.name);
    cy.findByRole('textbox', { name: 'Website Url' }).type(testSponsor.website);
    cy.findByRole('textbox', { name: 'Logo Path' }).type(testSponsor.logo_path);
    cy.findByRole('combobox', { name: 'Sponsor Type' }).select(
      testSponsor.type,
    );
    cy.findByRole('button', { name: 'Add New Sponsor' }).click();

    cy.findByRole('heading', { name: 'Sponsors' });
    cy.findByRole('link', { name: testSponsor.name }).click();
    cy.contains('Loading the sponsor details');
    cy.get('[data-cy=name]').contains(testSponsor.name);
    cy.get('[data-cy=website]').contains(testSponsor.website);
    cy.get('[data-cy=type]').contains(testSponsor.type);
  });

  it('lets an instance owner edit sponsors', () => {
    cy.visit('/dashboard/sponsors/1/edit');
    cy.findByRole('textbox', { name: 'Sponsor Name' })
      .clear()
      .type(testSponsor.name);
    cy.findByRole('textbox', { name: 'Website Url' })
      .clear()
      .type(testSponsor.website);
    cy.findByRole('textbox', { name: 'Logo Path' })
      .clear()
      .type(testSponsor.logo_path);
    cy.findByRole('combobox', { name: 'Sponsor Type' }).select(
      testSponsor.type,
    );

    cy.findByRole('button', { name: 'Save Sponsor Changes' }).click();
    cy.findByRole('heading', { name: 'Sponsors' });
    cy.findByRole('link', { name: testSponsor.name }).click();
    cy.get('[data-cy=name]').contains(testSponsor.name);
    cy.get('[data-cy=website]').contains(testSponsor.website);
    cy.get('[data-cy=type]').contains(testSponsor.type);
  });

  it('prevents chapter admins from managing sponsors', () => {
    cy.login('admin@of.chapter.one');

    cy.visit('/dashboard/');
    cy.findByRole('link', { name: 'Sponsors' }).should('not.exist');

    cy.createSponsor(testSponsor).then(expectToBeRejected);
    cy.updateSponsor(1, testSponsor).then(expectToBeRejected);
  });
});
