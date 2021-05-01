import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(__dirname, '../../.env') });
export interface Environment {
  NODE_ENV: 'production' | 'development' | 'test' | undefined;
  JWT_SECRET: string;

  // DB_USER=dev
  // DB_PASSWORD=foobar123
  // DB_NAME=chapter
  // DB_URL=localhost
  // IS_DOCKER=

  // CHAPTER_EMAIL=ourEmail@placeholder.place
  // EMAIL_USERNAME=project.1
  // EMAIL_PASSWORD=secret.1
  // EMAIL_SERVICE=emailServicePlaceholder
}

export const getConfig = <T extends keyof Environment>(
  key: T,
  fallback?: Environment[T],
): Environment[T] => {
  const val = process.env[key];

  if (!val) {
    if (!fallback) {
      throw new Error(
        `ENV variable ${key} is missing. This should be defined in your environment or .env file.`,
      );
    }

    return fallback;
  }

  return val as Environment[T];
};

export const getEnv = () => getConfig('NODE_ENV', 'development');
export const isDev = () => getEnv() === 'development';
export const isProd = () => getEnv() === 'production';
export const isTest = () => getEnv() === 'test';
