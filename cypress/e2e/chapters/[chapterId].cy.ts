import { ChapterMembers } from '../../../cypress.config';
import { expectToBeRejected } from '../../support/util';

const chapterId = 1;

describe('chapter page', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('user can join chapter and change subscription status', () => {
    cy.login('test@user.org');
    cy.visit(`/chapters/${chapterId}`);

    cy.findByRole('button', { name: 'Join chapter' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains(/joined chapter/);
    cy.contains(/Join chapter/).should('not.exist');
    cy.contains(/Subscribe/);

    cy.findByRole('button', { name: 'Subscribe' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains(/subscribed/);

    cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
      (chapter_users) => {
        expect(
          chapter_users.findIndex(
            ({ user: { email }, subscribed }) =>
              email === 'test@user.org' && subscribed,
          ),
        ).to.not.equal(-1);
      },
    );

    cy.contains(/Unsubscribe/);
    cy.findByRole('button', { name: 'Unsubscribe' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    // TODO Check if user event_reminders were cleared and user event_users unsubscribed for events in this chapter. And other chapters were not affected.
    cy.contains(/unsubscribed/);
    cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
      (chapter_users) => {
        expect(
          chapter_users.findIndex(
            ({ user: { email }, subscribed }) =>
              email === 'test@user.org' && subscribed,
          ),
        ).to.equal(-1);
      },
    );
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });
});
