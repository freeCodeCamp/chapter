import { join } from 'path';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const result = config({ path: join(__dirname, '../../../.env') });

if (result.error) {
  console.warn(`
  ----------------------------------------------------
  Warning: .env file not found.
  ----------------------------------------------------
  Please copy .env.example to .env
  You can ignore this warning if using a different way
  to setup this environment.
  ----------------------------------------------------
  `);
} else {
  expand(result);
}

export interface Environment {
  NODE_ENV: 'production' | 'development' | 'test' | undefined;
  UNSUBSCRIBE_SECRET: string;
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
export const isTest = () => getEnv() === 'test';
export const isProd = () => !isDev() && !isTest();
