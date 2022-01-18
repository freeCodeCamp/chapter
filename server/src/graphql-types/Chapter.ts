import { ObjectType, Field, Int } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class Chapter extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  imageUrl!: string;

  @Field(() => Int)
  creator_id: number;
}
