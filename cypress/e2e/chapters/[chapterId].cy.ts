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
    cy.contains(/Unsubscribe/);

    cy.findByRole('button', { name: 'Unsubscribe' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    // TODO Check if user event_reminders were cleared and user event_users unsubscribed for events in this chapter. And other chapters were not affected.
    cy.contains(/unsubscribed/);
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
  });

  it('is possible to join using the email links', () => {
    cy.login('test@user.org');
    cy.visit('/chapters/1?ask_to_confirm=true');
    cy.contains('member of the chapter').should('not.exist');

    cy.contains('You have been invited to this chapter');
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.get('[data-cy="join-success"]').should('be.visible');

    // After joining, the modal should not trigger on reload.
    cy.reload();
    cy.get('[data-cy="join-success"]').should('be.visible');
    cy.contains('You have been invited to this chapter').should('not.exist');
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });
});
