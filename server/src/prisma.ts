import { PrismaClient } from '@prisma/client';

// importing config so the .env gets parsed
import 'src/config';

export const prisma = new PrismaClient();
