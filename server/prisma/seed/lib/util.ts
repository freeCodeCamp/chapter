import { randomItems } from './random';

export const makeBooleanIterator = (flip = false) => {
  return {
    next() {
      flip = !flip;
      return { value: flip, done: false };
    },
  };
};

const tagNames = [
  'GraphQl',
  'NodeJs',
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Cypress',
  'Tailwind',
  'Sass',
  'BootStrap',
  'React',
  'Vue',
  'NextJs',
  'NuxtJs',
  'Angular',
  'Svelte',
  'SvelteKit',
  'Vite',
  'Prisma',
  'Ruby',
  'Rust',
];

export const selectTags = (count: number) => randomItems(tagNames, count, true);
