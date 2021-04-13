import { company, lorem, address } from 'faker';
import { Chapter, User } from '../../../server/models';

const createChapters = async (user: User): Promise<Chapter[]> => {
  const chapters: Chapter[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.companyName();
    const description = lorem.words();
    const category = lorem.word();
    // const details = { email: internet.email() };

    const chapter = new Chapter({
      name,
      description,
      category,
      details: 'random',
      creator: user,
      country: address.country(),
      city: address.city(),
      region: address.state(),
    });

    chapters.push(chapter);
  }

  try {
    await Promise.all(chapters.map((chapter) => chapter.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding chapters');
  }

  return chapters;
};

export default createChapters;
