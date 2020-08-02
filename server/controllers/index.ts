import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';

const resolvers = [ChapterResolver, VenueResolver] as const;

export { resolvers };
