import { User, Chapter, UserChapterRole, UserBan } from '../../server/models';
import { makeBooleanIterator } from './lib/util';

const setupRoles = async (
  admin: User,
  users: User[],
  chapters: Chapter[],
): Promise<void> => {
  const ucr: (UserChapterRole | UserBan)[] = [];

  const chapterIterator = makeBooleanIterator();
  for (const chapter of chapters) {
    const chapterUser = new UserChapterRole({
      chapterId: chapter.id,
      userId: admin.id,
      roleName: 'organizer',
      interested: true,
    });

    const [banned, ...others] = users;
    const ban = new UserBan({ chapter, user: banned });
    // makes sure half of each chapter's users are interested, but
    // alternates which half.
    const interestedIterator = makeBooleanIterator(
      chapterIterator.next().value,
    );
    for (const user of others) {
      const chapterUser = new UserChapterRole({
        chapterId: chapter.id,
        userId: user.id,
        roleName: 'member',
        interested: interestedIterator.next().value,
      });
      ucr.push(chapterUser);
    }

    ucr.push(chapterUser);
    ucr.push(ban);
  }

  try {
    await Promise.all(ucr.map((user) => user.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding roles');
  }
};

export default setupRoles;
