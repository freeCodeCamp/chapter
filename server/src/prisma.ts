import { PrismaClient } from '@prisma/client';

// importing config so the .env gets parsed
import './config';

export const prisma = new PrismaClient();

export const RECORD_MISSING = 'P2025';
export const UNIQUE_CONSTRAINT_FAILED = 'P2002';
