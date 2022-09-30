import { expectToBeRejected } from '../../support/util';

const chapterId = 1;

describe('chapter page', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('user can join chapter and change subscription status', () => {
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
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });

  it('user can leave chapter', () => {
    cy.leaveChapter(chapterId, { withAuth: true }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;
    });
  });

  it('should reject leaving chapter from non-members', () => {
    cy.leaveChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
  });
});
