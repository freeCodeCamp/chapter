import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

// registerEnumType(ChapterRoles, { name: 'ChapterRoles' });
// TODO: Make this enum
export type ChapterRoles = 'organizer' | 'member';

@ObjectType()
export class UserChapterRole {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  chapter_id: number;

  @Field(() => User)
  user: User;

  @Field(() => Boolean)
  interested: boolean;
}
