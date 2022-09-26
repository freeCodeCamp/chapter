const profilePage = '/profile';
const testUserEmail = 'test@user.org';
const chapterIdToJoin = 1;
const eventIdToJoin = 1;

describe('profile page', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });
  describe('automatic subscription', () => {
    beforeEach(() => {
      cy.login(testUserEmail);
    });
    it('when enabled, should automatically subscribe when joining chapter or RSVPing event', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).should(
        'be.checked',
      );
      cy.joinChapter(chapterIdToJoin);
      cy.getChapterMembers(chapterIdToJoin).then((chapterUsers) =>
        checkSubscription(chapterUsers, true),
      );

      cy.toggleChapterSubscription(chapterIdToJoin);
      cy.getChapterMembers(chapterIdToJoin).then((chapterUsers) =>
        checkSubscription(chapterUsers, false),
      );
      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.getEventUsers(eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, true),
      );
    });

    it('when disabled, should not automatically subscribe when joining chapter or RSVPing event', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).as(
        'switch',
      );
      cy.get('@switch').uncheck({ force: true });
      cy.get('@switch').should('not.be.checked');
      cy.joinChapter(chapterIdToJoin);
      cy.getChapterMembers(chapterIdToJoin).then((chapterUsers) =>
        checkSubscription(chapterUsers, false),
      );
      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.getEventUsers(eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, false),
      );
    });

    it('when disabled, RSVPing to event from subscribed chapter will subscribe to event', () => {
      cy.joinChapter(chapterIdToJoin);
      cy.getChapterMembers(chapterIdToJoin).then((chapterUsers) =>
        checkSubscription(chapterUsers, true),
      );

      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).as(
        'switch',
      );
      cy.get('@switch').uncheck({ force: true });
      cy.get('@switch').should('not.be.checked');

      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.getEventUsers(eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, true),
      );
    });

    function checkSubscription(users, status: boolean) {
      const user = users.filter(
        ({ user: { email } }) => email === testUserEmail,
      );
      expect(user.length).to.eq(1);
      expect(user[0].subscribed).to.eq(status);
    }
  });
});
