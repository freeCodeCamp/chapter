import { ChapterMembers, EventUsers } from '../../cypress.config';
const profilePage = '/profile';
const chapterIdToJoin = 1;
const eventIdToJoin = 1;

interface User {
  user: { name: string };
  subscribed: boolean;
}
interface CheckSubscriptionData {
  userName: string;
  users: User[];
  status: boolean;
}

function checkSubscription({ userName, users, status }: CheckSubscriptionData) {
  const user = users.filter(({ user: { name } }) => name === userName);
  expect(user.length).to.eq(1);
  expect(user[0].subscribed).to.eq(status);
}

describe('profile page', () => {
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
  });
  describe('automatic chapter subscription', () => {
    beforeEach(() => {
      cy.login(users.testUser.email);
    });
    it('when enabled, should automatically subscribe when joining chapter', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).as('switch');

      cy.get('@switch').check({ force: true });
      cy.get('@switch').should('be.checked');
      cy.findByRole('button', { name: 'Save Profile Changes' }).click();

      cy.joinChapter(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) =>
          checkSubscription({
            userName: users.testUser.name,
            users: chapterUsers,
            status: true,
          }),
      );

      cy.toggleChapterSubscription(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) =>
          checkSubscription({
            userName: users.testUser.name,
            users: chapterUsers,
            status: false,
          }),
      );
    });

    it('when disabled, should not automatically subscribe to chapter when joining chapter', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).should('not.be.checked');

      cy.joinChapter(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) =>
          checkSubscription({
            userName: users.testUser.name,
            users: chapterUsers,
            status: false,
          }),
      );
    });

    it('should not affect default subscribing to event', () => {
      cy.joinChapter(chapterIdToJoin);
      cy.toggleChapterSubscription(chapterIdToJoin);
      cy.task<ChapterMembers>('getChapterMembers', chapterIdToJoin).then(
        (chapterUsers) =>
          checkSubscription({
            userName: users.testUser.name,
            users: chapterUsers,
            status: true,
          }),
      );

      cy.visit(profilePage);
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).should('not.be.checked');

      cy.rsvpToEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.task<EventUsers>('getEventUsers', eventIdToJoin).then((eventUsers) =>
        checkSubscription({
          userName: users.testUser.name,
          users: eventUsers,
          status: true,
        }),
      );
    });
  });
});
