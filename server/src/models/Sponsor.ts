import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { EventSponsor } from './EventSponsor';

@ObjectType()
export class Sponsor extends BaseModel {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  website!: string;

  @Field(() => String)
  logo_path!: string;

  @Field(() => String)
  type!: string;

  @Field(() => [EventSponsor])
  events!: EventSponsor[];
}
