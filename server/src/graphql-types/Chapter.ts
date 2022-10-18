import { ObjectType, Field, Int } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { ChapterUser, Event, EventWithVenue, UserBan } from '.';

@ObjectType()
export class Chapter extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  chat_url?: string | null;

  @Field(() => String)
  category: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  banner_url!: string;

  @Field(() => Int)
  creator_id: number;
}

@ObjectType()
export class ChapterWithRelations extends Chapter {
  @Field(() => [Event])
  events: Event[];

  @Field(() => [ChapterUser])
  chapter_users: ChapterUser[];

  @Field(() => [UserBan])
  user_bans: UserBan[];
}

@ObjectType()
export class ChapterWithEvents extends Chapter {
  @Field(() => [EventWithVenue])
  events: EventWithVenue[];
}

@ObjectType()
export class ChapterCard extends Chapter {
  @Field(() => [Event])
  events: Event[];

  @Field(() => [ChapterUser])
  chapter_users: ChapterUser[];
}
