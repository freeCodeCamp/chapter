import { Field, ObjectType, Float } from 'type-graphql';
import { BaseModel } from './BaseModel';

@ObjectType()
export class Venue extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  street_address?: string | null;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postal_code: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => Float, { nullable: true })
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  longitude?: number | null;
}
