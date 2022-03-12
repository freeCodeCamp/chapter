import { Field, ObjectType } from 'type-graphql';
import { Chapter, ChapterUser, Event } from '.';

@ObjectType()
export class ChapterWithRelations extends Chapter {
  @Field(() => [Event])
  events: Event[];

  @Field(() => [ChapterUser])
  chapter_users: ChapterUser[];
}
