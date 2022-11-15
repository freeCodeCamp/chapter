import { ObjectType, Field } from 'type-graphql';
import { Chapter } from './Chapter';
import { User } from './User';

@ObjectType()
export class UserBan {
  @Field(() => Number)
  chapter_id: number;

  @Field(() => Number)
  user_id: number;
}

@ObjectType()
export class UserBanWithRelations extends UserBan {
  @Field(() => User)
  user: User;

  @Field(() => Chapter)
  chapter: Chapter;
}
