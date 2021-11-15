import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Chapter } from './Chapter';
import { EventSponsor } from './EventSponsor';
import { Rsvp } from './Rsvp';
import { Tag } from './Tag';
import { UserEventRole } from './UserEventRole';
import { Venue } from './Venue';

export enum VenueType {
  Physical = 'Physical',
  Online = 'Online',
  PhysicalAndOnline = 'PhysicalAndOnline',
}

registerEnumType(VenueType, {
  name: 'VenueType',
  description: 'All possible venue types for an event',
});

@ObjectType()
export class Event extends BaseModel {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  streaming_url?: string;

  @Field(() => VenueType)
  venue_type!: VenueType;

  @Field(() => Date)
  start_at!: Date;

  @Field(() => Date)
  ends_at!: Date;

  @Field(() => Boolean)
  canceled!: boolean;

  @Field(() => Int)
  capacity!: number;

  @Field(() => Boolean)
  invite_only!: boolean;

  @Field(() => [EventSponsor])
  sponsors: EventSponsor[];

  @Field(() => Venue, { nullable: true })
  venue?: Venue;

  @Field(() => Chapter)
  chapter!: Chapter;

  @Field(() => [Rsvp])
  rsvps!: Rsvp[];

  @Field(() => [Tag], { nullable: true })
  tags!: Tag[];

  @Field(() => [UserEventRole])
  user_roles!: UserEventRole[];

  @Field(() => String)
  image_url!: string;
}
