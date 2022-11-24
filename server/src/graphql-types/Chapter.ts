import { ObjectType, Field, Int } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { ChapterUserWithRelations, Event, EventWithVenue, UserBan } from '.';

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

  @Field(() => String, { nullable: true })
  banner_url?: string | null;

  @Field(() => String, { nullable: true })
  logo_url?: string | null;

  @Field(() => Int)
  creator_id: number;

  @Field(() => String, { nullable: true })
  calendar_id?: string | null;
}

@ObjectType()
export class ChapterWithRelations extends Chapter {
  @Field(() => [Event])
  events: Event[];

  @Field(() => [ChapterUserWithRelations])
  chapter_users: ChapterUserWithRelations[];

  @Field(() => [UserBan])
  user_bans: UserBan[];
}

@ObjectType()
export class ChapterWithEvents extends Chapter {
  @Field(() => [EventWithVenue])
  events: EventWithVenue[];
}
