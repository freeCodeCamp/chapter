import { makeBooleanIterator } from './lib/util';
import {
  User,
  Chapter,
  UserChapterRole,
  UserBan,
  Event,
  UserEventRole,
} from 'src/models';

const setupRoles = async (
  admin: User,
  users: User[],
  chapters: Chapter[],
  events: Event[],
): Promise<void> => {
  const ucr: (UserChapterRole | UserBan)[] = [];
  const uer: UserEventRole[] = [];

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

  const eventIterator = makeBooleanIterator();
  for (const event of events) {
    // makes sure half of each event's users are organisers, but
    // alternates which half.
    const organizerIterator = makeBooleanIterator(eventIterator.next().value);
    for (const user of users) {
      if (organizerIterator.next().value) {
        const userEventRole = new UserEventRole({
          eventId: event.id,
          userId: user.id,
          roleName: 'organizer',
        });
        uer.push(userEventRole);
      }
    }
  }

  try {
    await Promise.all(ucr.map((user) => user.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding user-chapter-roles');
  }
  try {
    await Promise.all(uer.map((user) => user.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding user-event-roles');
  }
};

export default setupRoles;
