import { Field, ObjectType } from 'type-graphql';
import { Chapter, UserChapterRole, Event } from '.';

@ObjectType()
export class ChapterWithRelations extends Chapter {
  @Field(() => [Event])
  events: Event[];

  @Field(() => [UserChapterRole])
  users: UserChapterRole[];
}
