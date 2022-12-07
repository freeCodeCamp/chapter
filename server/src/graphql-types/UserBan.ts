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
export class UserBanChapters extends UserBan {
  @Field(() => Chapter)
  chapter: Chapter;
}

@ObjectType()
export class UserBanWithRelations extends UserBanChapters {
  @Field(() => User)
  user: User;
}
