import { Field, ObjectType, Int } from 'type-graphql';
import { User } from './User';
import { ChapterRole } from './ChapterRole';
import { Chapter } from './Chapter';

@ObjectType()
export class ChapterUser {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  chapter_id: number;

  @Field(() => Date)
  joined_date: Date;

  @Field(() => Boolean)
  subscribed: boolean;

  @Field(() => Boolean, { nullable: true })
  is_bannable?: boolean;
}

@ObjectType()
export class ChapterUserWithRole extends ChapterUser {
  @Field(() => ChapterRole)
  chapter_role: ChapterRole;
}

@ObjectType()
export class ChapterUserWithRelations extends ChapterUserWithRole {
  @Field(() => User)
  user: User;
}

@ObjectType()
export class UserChapter extends ChapterUserWithRole {
  @Field(() => Chapter)
  chapter: Chapter;
}
