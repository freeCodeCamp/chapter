import { expectToBeRejected } from '../../support/util';

const chapterId = 1;

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
