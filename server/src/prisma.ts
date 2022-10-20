import { PrismaClient } from '@prisma/client';

// importing config so the .env gets parsed
import './config';

export const prisma = new PrismaClient();

/* Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes */
export const RECORD_MISSING = 'P2025';
export const UNIQUE_CONSTRAINT_FAILED = 'P2002';
