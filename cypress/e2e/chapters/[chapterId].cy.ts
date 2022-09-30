import { expectToBeRejected } from '../../support/util';

const chapterId = 1;

describe('chapter page', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
  });

  it('user can join chapter and change subscription status', () => {
    cy.login('test@user.org');
    cy.visit(`/chapters/${chapterId}`);

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

    cy.getChapterMembers(chapterId).then((chapter_users) => {
      expect(
        chapter_users.findIndex(
          ({ user: { email }, subscribed }) =>
            email === 'test@user.org' && subscribed,
        ),
      ).to.not.equal(-1);
    });
  });

  it('should reject joining and subscribing requests from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
    cy.toggleChapterSubscription(chapterId, { withAuth: false }).then(
      expectToBeRejected,
    );
  });

  it('user can leave chapter', () => {
    cy.login('test@user.org');
    cy.visit(`/chapters/${chapterId}`);

    cy.leaveChapter(chapterId, { withAuth: true }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;
    });
  });

  it('should reject leaving chapter from non-members', () => {
    cy.joinChapter(chapterId, { withAuth: false }).then(expectToBeRejected);
  });
});
