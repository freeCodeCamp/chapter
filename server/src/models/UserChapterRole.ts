import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';
// import { Chapter } from './Chapter';
import { User } from './User';

// registerEnumType(ChapterRoles, { name: 'ChapterRoles' });
// TODO: Make this enum
export type ChapterRoles = 'organizer' | 'member';

@ObjectType()
export class UserChapterRole extends BaseJunctionModel {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  chapter_id: number;

  // @Field(() => String)
  // role_name!: ChapterRoles;

  @Field(() => User)
  user: User;

  // @Field(() => Chapter)
  // chapter!: Chapter;

  @Field(() => Boolean)
  interested: boolean;
}
