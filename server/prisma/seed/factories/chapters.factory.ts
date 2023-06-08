import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';
import { selectTags } from '../lib/util';

const { company, lorem, address, image } = faker;

const createChapters = async (userId: number): Promise<number[]> => {
  const chapterIds: number[] = [];

  for (let i = 0; i < 4; i++) {
    const name = company.companyName();
    const description = lorem.words();
    const category = lorem.word();

    const tagsCount = Math.round(Math.random() * 4);
    const selectedTags = selectTags(tagsCount);
    const connectOrCreateTags = selectedTags.map((name) => ({
      tag: { connectOrCreate: { where: { name }, create: { name } } },
    }));

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
      logo_url: image.imageUrl(150, 150, 'tech', true, true),
      banner_url: image.imageUrl(640, 480, 'tech', true, true),
      chapter_tags: { create: connectOrCreateTags },
    };

    // TODO: batch this once createMany returns the records.
    const chapter = await prisma.chapters.create({ data: chapterData });

    chapterIds.push(chapter.id);
  }

  return chapterIds;
};

export default createChapters;
