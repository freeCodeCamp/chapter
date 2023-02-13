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
    it('by default users should automatically subscribe when joining chapters', () => {
      cy.visit(profilePage);
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).should('be.checked');

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
      cy.contains('will be notified');
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      })
        .should('be.checked')
        .uncheck({ force: true });
      cy.findByRole('button', { name: 'Save Profile Changes' }).click();
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

    it('users should be subscribed to events they attend, regardless of auto_subscribe', () => {
      // first with auto_subscribe enabled
      cy.visit(profilePage);
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).check({ force: true });

      cy.joinChapter(chapterIdToJoin);
      cy.attendEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
      cy.task<EventUsers>('getEventUsers', eventIdToJoin).then((eventUsers) => {
        checkSubscription({
          userName: users.testUser.name,
          users: eventUsers,
          status: true,
        });
        const eventUser = eventUsers.find(
          ({ user: { name } }) => name === users.testUser.name,
        );
        cy.task('deleteEventUser', {
          eventId: eventIdToJoin,
          userId: eventUser.user.id,
        });
      });

      // now with auto_subscribe disabled
      cy.findByRole('checkbox', {
        name: 'Subscribe to chapters when joining them',
      }).uncheck({ force: true });
      // leave and rejoin chapter to clear out old subscription
      cy.leaveChapter(chapterIdToJoin);
      cy.joinChapter(chapterIdToJoin);

      cy.attendEvent({ eventId: eventIdToJoin, chapterId: chapterIdToJoin });
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
