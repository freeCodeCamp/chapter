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

    cy.findByRole('button', { name: 'Join Chapter' }).click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.findByRole('button', { name: 'Leave Chapter' }).should('be.visible');
    cy.findByRole('button', { name: 'Join Chapter' }).should('not.exist');
    cy.get('[data-cy="subscribe-chapter"]').should('not.exist');
    cy.get('[data-cy="unsubscribe-chapter"]').should('be.visible').click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains('unsubscribed from new events');
    cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
      (chapter_users) => {
        expect(
          chapter_users.find(
            ({ user: { email }, subscribed }) =>
              email === users.testUser.email && !subscribed,
          ),
        ).to.exist;
      },
    );

    cy.get('[data-cy="subscribe-chapter"]').should('be.visible').click();
    cy.findByRole('button', { name: 'Confirm' }).click();

    cy.contains('successfully subscribed to new events');
    cy.task<ChapterMembers>('getChapterMembers', chapterId).then(
      (chapter_users) => {
        expect(
          chapter_users.find(
            ({ user: { email }, subscribed }) =>
              email === users.testUser.email && subscribed,
          ),
        ).to.exist;
      },
    );
    cy.leaveChapter(chapterId, { withAuth: true }).then(expectNoErrors);
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
