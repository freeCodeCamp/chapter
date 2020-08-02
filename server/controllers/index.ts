import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';
import { EventResolver } from './Events/resolver';

const resolvers = [ChapterResolver, VenueResolver, EventResolver] as const;

export { resolvers };
