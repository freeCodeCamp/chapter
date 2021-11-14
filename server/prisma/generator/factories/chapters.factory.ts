import { Prisma } from '@prisma/client';
import { company, lorem, address, image } from 'faker';
import { User } from 'src/models';
import { prisma } from 'src/prisma';

const createChapters = async (user: User): Promise<number[]> => {
  const chapters: number[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.companyName();
    const description = lorem.words();
    const category = lorem.word();

    // TODO: we shouldn't need to use the unchecked type here. The database
    // schema may need modifying.
    const chapterData: Prisma.chaptersUncheckedCreateInput = {
      name,
      description,
      category,
      details: 'random',
      creator_id: user.id,
      country: address.country(),
      city: address.city(),
      region: address.state(),
      imageUrl: image.imageUrl(640, 480, 'tech', true),
    };

    // TODO: batch this once createMany returns the records.
    const chapter = await prisma.chapters.create({ data: chapterData });

    chapters.push(chapter.id);
  }

  return chapters;
};

export default createChapters;
