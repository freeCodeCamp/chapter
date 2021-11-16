import { ObjectType, Field } from 'type-graphql';
import { Chapter } from './Chapter';
import { User } from './User';

@ObjectType()
export class UserBan {
  @Field(() => User)
  user: User;

  @Field(() => Chapter)
  chapter: Chapter;
}
