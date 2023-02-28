import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { internet } = faker;

const createInstanceSettings = async () => {
  const instanceSettingsData: Prisma.instance_settingsCreateInput = {
    id: 1,
    privacy_link: internet.url(),
    terms_of_services_link: internet.url(),
    code_of_conduct_link: internet.url(),
  };
  await prisma.instance_settings.create({ data: instanceSettingsData });
};

export default createInstanceSettings;
