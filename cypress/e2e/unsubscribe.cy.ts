import { ChapterMembers, EventUsers } from '../../cypress.config';

describe('unsubscribe link', () => {
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.mhDeleteAll();
  });

  it('should allow for unsubscribing without being logged in', () => {
    const chapterId = 1;
    const emailAddress = users.owner.email;
    cy.login();
    cy.getChapterEvents(chapterId).then((events) => {
      const eventIds = events.map(({ id }) => id);
      eventIds.forEach((eventId) => {
        cy.attendEvent({ eventId, chapterId });
      });
      cy.logout();
      const eventIdToUnsubscribe = eventIds[eventIds.length - 1];
      const otherChapterEventIds = eventIds.slice(0, -1);

      cy.mhGetMailsByRecipient(emailAddress).mhFirst().as('mail');
      cy.get('@mail')
        .mhGetBody()
        .then((body) => {
          const bodyWithDecodedLongLines = body.replace(/=\s\s/g, '');
          const unsubscribeLinks = [
            ...bodyWithDecodedLongLines.matchAll(
              /<a href=3D"(.*unsubscribe[^>]+?)">/g,
            ),
          ];
          expect(unsubscribeLinks.length).to.eq(2);
          const [unsubscribeEventToken, unsubscribeChapterToken] =
            unsubscribeLinks.map(
              (link) => link[1].match(/token=3D([\s\S]*)/)[1],
            );

          cy.visit(`/unsubscribe?token=${unsubscribeEventToken}`);
          cy.contains('Unsubscribing');
          cy.findByLabelText('Confirm unsubscribing').parent().click();
          cy.findByRole('button', { name: 'Submit' }).click();

          cy.contains('Unsubscribed');
          cy.task<EventUsers>('getEventUsers', eventIdToUnsubscribe).then(
            (eventUsers) => {
              const unsubscribedUser = eventUsers.find(
                ({ user: { email } }) => email === emailAddress,
              );
              expect(unsubscribedUser.subscribed).to.be.false;
            },
          );

          cy.visit(`/unsubscribe?token=${unsubscribeChapterToken}`);
          cy.contains('Unsubscribing');
          cy.findByLabelText('Confirm unsubscribing').parent().click();
          cy.findByRole('button', { name: 'Submit' }).click();

          cy.contains('Unsubscribed');
          cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
            (chapter_users) => {
              expect(
                chapter_users.find(
                  ({ user: { email } }) => email === emailAddress,
                ).subscribed,
              ).to.eq(false);
            },
          );

          otherChapterEventIds.forEach((eventId) => {
            cy.task<EventUsers>('getEventUsers', eventId).then((eventUsers) => {
              const unsubscribedUser = eventUsers.find(
                ({ user: { email } }) => email === emailAddress,
              );
              expect(unsubscribedUser.subscribed).to.be.true;
            });
          });
        });
    });
  });
});
