describe('chapter page', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });

  it('user can join chapter and change subscription status', () => {
    cy.register('Test', 'User', 'test@user.org');
    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.visit('/chapters/1');

    cy.findByRole('button', { name: 'Join chapter' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains(/joined chapter/);
    cy.contains(/Join chapter/).should('not.exist');
    cy.contains(/Unsubscribe/);

    cy.findByRole('button', { name: 'Unsubscribe' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    // TODO Check if user event_reminders were cleared and user event_users unsubscribed for events in this chapter. And other chapters were not affected.
    cy.contains(/unsubscribed/);
    cy.contains(/Subscribe/);

    cy.findByRole('button', { name: 'Subscribe' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains(/subscribed/);

    cy.getChapterMembers(1).then((chapter_users) => {
      expect(
        chapter_users.findIndex(
          ({ user: { email }, subscribed }) =>
            email === 'test@user.org' && subscribed,
        ),
      ).to.not.equal(-1);
    });
  });
});
