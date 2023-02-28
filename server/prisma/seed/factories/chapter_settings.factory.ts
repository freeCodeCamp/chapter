import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { internet } = faker;

const createChapterSettings = async () => {
  const chapterSettingsData: Prisma.chapter_settingsCreateInput = {
    id: 1,
    privacy_link: internet.url(),
    terms_of_services_link: internet.url(),
    code_of_conduct_link: internet.url(),
  };
  await prisma.chapter_settings.create({ data: chapterSettingsData });
};

export default createChapterSettings;
