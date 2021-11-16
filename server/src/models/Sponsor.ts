import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';

@ObjectType()
export class Sponsor extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => String)
  website: string;

  @Field(() => String)
  logo_path: string;

  @Field(() => String)
  type: string;
}
