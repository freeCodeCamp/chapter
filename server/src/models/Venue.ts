import { Field, ObjectType, Float } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Event } from './Event';

@ObjectType()
export class Venue extends BaseModel {
  @Field(() => String)
  name!: string;

  @Field(() => [Event])
  events!: Event[];

  @Field(() => String, { nullable: true })
  street_address?: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postal_code: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;
}
