import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { company, lorem, address, image } = faker;

const createChapters = async (userId: number): Promise<number[]> => {
  const chapterIds: number[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.companyName();
    const description = lorem.words();
    const category = lorem.word();
    const tagNames = [
      'Front End Development',
      'Back End Development',
      'FullStack Development',
      'Cat Adoring',
      'Dog Adoring',
      'SNAKES',
      'DevOps',
      'Consulting',
      'Hang Out',
      'Security',
    ];
    const randomTag = Math.floor(Math.random() * tagNames.length);

    const tag = tagNames[randomTag];
    // TODO: we shouldn't need to use the unchecked type here. The database
    // schema may need modifying.
    const chapterData: Prisma.chaptersUncheckedCreateInput = {
      name,
      description,
      category,
      creator_id: userId,
      country: address.country(),
      city: address.city(),
      region: address.state(),
      tag,
      imageUrl: image.imageUrl(640, 480, 'tech', true),
    };

    // TODO: batch this once createMany returns the records.
    const chapter = await prisma.chapters.create({ data: chapterData });

    chapterIds.push(chapter.id);
  }

  return chapterIds;
};

export default createChapters;
