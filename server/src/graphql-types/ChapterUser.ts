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

  @Field(() => ChapterRole)
  chapter_role: ChapterRole;

  @Field(() => User)
  user: User;

  @Field(() => Chapter)
  chapter: Chapter;

  @Field(() => Boolean, { nullable: true })
  is_bannable?: boolean;
}
