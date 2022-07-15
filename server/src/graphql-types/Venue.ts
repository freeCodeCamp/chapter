import { Field, ObjectType, Float, Int } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class Venue extends BaseObject {
  @Field(() => Int)
  chapter_id: number;

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
