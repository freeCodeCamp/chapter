import { User, Chapter, UserChapterRole, UserBan } from '../../server/models';

const setupRoles = async (
  admin: User,
  users: User[],
  chapters: Chapter[],
): Promise<void> => {
  const ucr: (UserChapterRole | UserBan)[] = [];

  for (const chapter of chapters) {
    const chapterUser = new UserChapterRole({
      chapterId: chapter.id,
      userId: admin.id,
      roleName: 'organizer',
    });

    const [banned, ...others] = users;
    const ban = new UserBan({ chapter, user: banned });

    for (const user of others) {
      const chapterUser = new UserChapterRole({
        chapterId: chapter.id,
        userId: user.id,
        roleName: 'member',
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
