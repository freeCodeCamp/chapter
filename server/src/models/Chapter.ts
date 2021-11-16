import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';

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
}
