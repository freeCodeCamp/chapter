import { PrismaClient } from '@prisma/client';

// importing config so the .env gets parsed
import './config';

export const prisma = new PrismaClient();
