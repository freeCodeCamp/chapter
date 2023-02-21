import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { SponsoredEvent } from './SponsoredEvent';

@ObjectType()
export class Sponsor extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  website: string;

  @Field(() => String)
  logo_path: string;

  @Field(() => String)
  type: string;
}

@ObjectType()
export class SponsorWithEvents extends Sponsor {
  @Field(() => [SponsoredEvent])
  event_sponsors: SponsoredEvent[];
}
