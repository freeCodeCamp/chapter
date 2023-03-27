import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { lorem } = faker;

const createInstanceSettings = async () => {
  const instanceSettingsData: Prisma.instance_settingsCreateInput = {
    description: lorem.paragraphs(2),
    policy_url: 'https://www.freecodecamp.org/news/privacy-policy/',
    terms_of_services_url:
      'https://www.freecodecamp.org/news/terms-of-service/',
    code_of_conduct_url: 'https://www.freecodecamp.org/news/code-of-conduct/',
    font_style: 'Roboto',
  };
  await prisma.instance_settings.create({ data: instanceSettingsData });
};

export default createInstanceSettings;
