import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { User } from './User';
import { UserBan } from './UserBan';
import { UserChapterRole } from './UserChapterRole';

@ObjectType()
export class Chapter extends BaseModel {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String)
  category!: string;

  @Field(() => String)
  details!: any;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  imageUrl!: string;

  @Field(() => [Event])
  events!: Event[];

  @Field(() => User)
  creator!: User;

  @Field(() => [UserChapterRole])
  users!: UserChapterRole[];

  @Field(() => [UserBan])
  banned_users!: UserBan[];
}
