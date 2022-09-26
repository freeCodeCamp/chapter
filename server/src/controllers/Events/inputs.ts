import { IsOptional, IsUrl } from 'class-validator';
import { InputType, Field, Int } from 'type-graphql';

import { events_venue_type_enum } from '../../graphql-types';

@InputType()
export class CreateEventInputs {
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
  streaming_url: string;

  @Field(() => events_venue_type_enum, { nullable: true })
  venue_type: events_venue_type_enum;

  @Field(() => Date)
  start_at: Date;

  @Field(() => Date)
  ends_at: Date;

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
  tags: string[];
}

@InputType()
export class UpdateEventInputs {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  url?: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  streaming_url: string;

  @Field(() => events_venue_type_enum, { nullable: true })
  venue_type: events_venue_type_enum;

  @Field(() => Date, { nullable: true })
  start_at: Date;

  @Field(() => Date, { nullable: true })
  ends_at: Date;

  @Field(() => Number, { nullable: true })
  capacity: number;

  @Field(() => Int, { nullable: true })
  venue_id: number;

  @Field(() => Int)
  chapter_id: number;

  @Field(() => Boolean, { nullable: true })
  invite_only: boolean;

  @Field(() => String, { nullable: true })
  image_url: string;

  @Field(() => [Int])
  sponsor_ids: number[];

  @Field(() => [String])
  tags: string[];
}
