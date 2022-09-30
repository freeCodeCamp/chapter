import { ChapterMembers, EventUsers } from '../../cypress.config';
const profilePage = '/profile';
const testUser = {
  email: 'test@user.org',
  name: 'Test User',
};
const chapterIdToJoin = 1;
const eventIdToJoin = 1;

describe('profile page', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });
  describe('automatic subscription', () => {
    beforeEach(() => {
      cy.login(testUser.email);
    });
    it('when enabled, should automatically subscribe when joining chapter or RSVPing event', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).as(
        'switch',
      );

      cy.get('@switch').check({ force: true });
      cy.get('@switch').should('be.checked');
      cy.findByRole('button', { name: 'Save Profile Changes' }).click();

      cy.joinChapter(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) => checkSubscription(chapterUsers, true),
      );

      cy.toggleChapterSubscription(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) => checkSubscription(chapterUsers, false),
      );
      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.task<EventUsers>('getEventUsers', eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, true),
      );
    });

    it('when disabled, should not automatically subscribe when joining chapter or RSVPing event', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).should(
        'not.be.checked',
      );

      cy.joinChapter(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) => checkSubscription(chapterUsers, false),
      );
      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.task<EventUsers>('getEventUsers', eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, false),
      );
    });

    it('when disabled, RSVPing to event from subscribed chapter will subscribe to event', () => {
      cy.joinChapter(chapterIdToJoin);
      cy.toggleChapterSubscription(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) => checkSubscription(chapterUsers, true),
      );

      cy.visit(profilePage);
      cy.findByRole('checkbox', { name: 'Automatic subscription' }).should(
        'not.be.checked',
      );

      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.task<EventUsers>('getEventUsers', eventIdToJoin).then((eventUsers) =>
        checkSubscription(eventUsers, true),
      );
    });

    function checkSubscription(users, status: boolean) {
      const user = users.filter(({ user: { name } }) => name === testUser.name);
      expect(user.length).to.eq(1);
      expect(user[0].subscribed).to.eq(status);
    }
  });
});
