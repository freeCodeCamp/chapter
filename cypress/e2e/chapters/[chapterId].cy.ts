import { expectToBeRejected } from '../../support/util';

const chapterId = 1;

describe('chapter page', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  //ToDo: check UI components are functioning as intended
  // the UI components of Chapter page haven't been set on stone, yet
  // And similar function will be added to profile for qulity of life
  // When both function set on stone, we can add guardrails to check
  // if nothing is breaking
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

  it('Owner can not join and leave chapter', () => {
    cy.login();

    cy.joinChapter(chapterId, { withAuth: true }).then(expectToBeRejected);
  });

  it('Owner can not join and leave chapter', () => {
    cy.login();

    cy.leaveChapter(chapterId, { withAuth: true }).then(expectToBeRejected);
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });

  it('should reject leaving chapter from non-members', () => {
    cy.leaveChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
  });
});
