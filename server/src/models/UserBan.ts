import { ObjectType, Field } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';
import { Chapter } from './Chapter';
import { User } from './User';

@ObjectType()
export class UserBan extends BaseJunctionModel {
  @Field(() => User)
  user!: User;

  @Field(() => Chapter)
  chapter!: Chapter;
}
