import { ChapterResolver } from './Chapter/resolver';
import { LocationResolver } from './Location/resolver';
import { VenueResolver } from './Venue/resolver';

const resolvers = [ChapterResolver, LocationResolver, VenueResolver] as const;

export { resolvers };
