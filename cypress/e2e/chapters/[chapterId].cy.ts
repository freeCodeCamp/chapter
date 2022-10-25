import { ChapterMembers } from '../../../cypress.config';
import { expectNoErrors, expectToBeRejected } from '../../support/util';

const chapterId = 1;
const joinText = 'You have been invited to this chapter';
const leaveText = 'Are you sure you want to leave';

describe('chapter page', () => {
  let users;
  before(() => {
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('user can join, leave chapter, and change subscription status', () => {
    cy.login(users.testUser.email);
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
              email === users.testUser.email && subscribed,
          ),
        ).to.not.equal(-1);
      },
    );
    cy.leaveChapter(chapterId, { withAuth: true }).then((response) => {
      expectNoErrors(response);
    });
  });

  it('is possible to join using the email links', () => {
    cy.login(users.testUser.email);
    cy.visit(`/chapters/${chapterId}?ask_to_confirm=true`);
    cy.contains('member of the chapter').should('not.exist');

    cy.contains(joinText);
    cy.findByRole('button', { name: 'Confirm' }).click();
    cy.get('[data-cy="join-success"]').should('be.visible');

    // First check that the invitation modal has gone...
    cy.contains(joinText).should('not.exist');
    // ...then check that leave modal has not appeared
    cy.contains(leaveText).should('not.exist');
  });

  it('is possible to leave using the email links', () => {
    cy.login('test@user.org');
    const chapterId = 1;
    cy.joinChapter(chapterId).then(() => {
      cy.visit(`/chapters/${chapterId}?ask_to_confirm=true`);
      cy.get('[data-cy="join-success"]').should('be.visible');

      cy.contains(leaveText);
      cy.findByRole('button', { name: 'Confirm' }).click();
      cy.get('[data-cy="join-success"]').should('not.exist');

      // First check that the leave modal has gone...
      cy.contains(leaveText).should('not.exist');
      // ...then check that invitation modal has not appeared
      cy.contains(joinText).should('not.exist');
    });
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });
});
