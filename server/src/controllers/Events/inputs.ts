import { IsOptional, IsPositive, IsUrl } from 'class-validator';
import { InputType, Field, Int } from 'type-graphql';

import { events_venue_type_enum } from '../../graphql-types';

@InputType()
export class EventInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  url?: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  streaming_url?: string;

  @Field(() => events_venue_type_enum, { nullable: true })
  venue_type: events_venue_type_enum;

  @Field(() => Date)
  start_at: Date;

  @Field(() => Date)
  ends_at: Date;

  @IsPositive()
  @Field(() => Number)
  capacity: number;

  @Field(() => Int, { nullable: true })
  venue_id: number;

  @Field(() => Boolean, { nullable: true })
  invite_only: boolean;

  @Field(() => String)
  image_url: string;

  @Field(() => [Int])
  sponsor_ids: number[];

  @Field(() => [String])
  event_tags: string[];
}
