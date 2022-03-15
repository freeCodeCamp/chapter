import { Field, ObjectType } from 'type-graphql';
import { Chapter, Event, EventSponsor, EventUser, Venue } from '.';

@ObjectType()
export class EventWithEverything extends Event {
  @Field(() => Chapter)
  chapter: Chapter;

  @Field(() => [EventSponsor])
  sponsors: EventSponsor[];

  @Field(() => Venue, { nullable: true })
  venue?: Venue | null;

  @Field(() => [EventUser])
  event_users: EventUser[];
}
