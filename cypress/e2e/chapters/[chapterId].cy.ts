import { expectToBeRejected } from '../../support/util';

const chapterId = 1;
const joinText = 'You have been invited to this chapter';
const leaveText = 'Are you sure you want to leave';

describe('chapter page', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('user can join, leave chapter, and change subscription status', () => {
    cy.login('test@user.org');

    cy.joinChapter(chapterId, { withAuth: true }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;
    });
    cy.toggleChapterSubscription(chapterId, { withAuth: true }).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body.errors).not.to.exist;
      },
    );
    cy.leaveChapter(chapterId, { withAuth: true }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;
    });
  });

  it('is possible to join using the email links', () => {
    cy.login('test@user.org');
    cy.visit('/chapters/1?ask_to_confirm=true');
    cy.get('[data-cy="join-success"]').should('not.exist');

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
