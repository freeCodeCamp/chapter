import { Field, ObjectType, Float, Int } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Chapter, ChapterWithEvents } from './Chapter';
import { Tags } from './Tag';

@ObjectType()
export class Venue extends BaseObject {
  @Field(() => Int)
  chapter_id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  street_address?: string | null;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postal_code: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => Float, { nullable: true })
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  longitude?: number | null;
}

@ObjectType()
export class VenueWithTags extends Venue {
  @Field(() => [Tags])
  venue_tags: Tags[];
}

@ObjectType()
export class VenueWithChapter extends Venue {
  @Field(() => Chapter)
  chapter: Chapter;
}

@ObjectType()
export class VenueWithChapterEvents extends VenueWithTags {
  @Field(() => ChapterWithEvents)
  chapter: ChapterWithEvents;
}
