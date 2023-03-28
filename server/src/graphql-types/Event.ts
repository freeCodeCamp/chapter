import { events_venue_type_enum } from '@prisma/client';
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  Chapter,
  EventSponsor,
  EventUserWithRelations,
  EventUserWithAttendanceAndUser,
  Venue,
  Tags,
} from '.';

export { events_venue_type_enum };

registerEnumType(events_venue_type_enum, {
  name: 'VenueType',
  description: 'All possible venue types for an event',
});

@ObjectType()
class total {
  @Field(() => Int)
  total: number;
}

@ObjectType()
export class Event extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  streaming_url?: string | null;

  @Field(() => events_venue_type_enum)
  venue_type: events_venue_type_enum;

  @Field(() => Date)
  start_at: Date;

  @Field(() => Date)
  ends_at: Date;

  @Field(() => Boolean)
  canceled: boolean;

  @Field(() => Int)
  capacity: number;

  @Field(() => Boolean)
  invite_only: boolean;

  @Field(() => String)
  image_url: string;

  calendar_event_id?: string | null;
}

@ObjectType()
export class EventWithTags extends Event {
  @Field(() => [Tags])
  event_tags: Tags[];
}

@ObjectType()
export class EventWithVenue extends EventWithTags {
  @Field(() => Venue, { nullable: true })
  venue?: Venue | null;
}

@ObjectType()
export class EventWithChapterAndVenue extends EventWithTags {
  @Field(() => Chapter)
  chapter: Chapter;

  @Field(() => Venue, { nullable: true })
  venue?: Venue | null;
}

@ObjectType()
class EventsWithChapters extends EventWithTags {
  @Field(() => Chapter)
  chapter: Chapter;
}

@ObjectType()
export class PaginatedEventsWithChapters extends total {
  @Field(() => [EventsWithChapters])
  events: EventsWithChapters[];
}

@ObjectType()
class EventRelationsWithoutEventUsers extends EventWithChapterAndVenue {
  @Field(() => [EventSponsor])
  sponsors: EventSponsor[];
}

@ObjectType()
export class EventWithRelationsWithEventUser extends EventRelationsWithoutEventUsers {
  @Field(() => [EventUserWithAttendanceAndUser])
  event_users: EventUserWithAttendanceAndUser[];
}

@ObjectType()
export class EventWithRelationsWithEventUserRelations extends EventRelationsWithoutEventUsers {
  @Field(() => [EventUserWithRelations])
  event_users: EventUserWithRelations[];
}
