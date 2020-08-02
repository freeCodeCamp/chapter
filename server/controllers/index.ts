import { ChapterResolver } from './Chapter/resolver';
import { LocationResolver } from './Location/resolver';

const resolvers = [ChapterResolver, LocationResolver] as const;

export { resolvers };
