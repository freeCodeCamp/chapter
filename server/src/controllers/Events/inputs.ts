import { IsUrl } from 'class-validator';
import { InputType, Field, Int } from 'type-graphql';
import { VenueType } from 'src/models';

@InputType()
export class CreateEventInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  url?: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  streaming_url?: string;

  @Field(() => VenueType, { nullable: true })
  venue_type: VenueType;

  @Field(() => Date)
  start_at: number;

  @Field(() => Date)
  ends_at: number;

  @Field(() => Number)
  capacity: number;

  @Field(() => Int, { nullable: true })
  venueId?: number;

  @Field(() => Int)
  chapterId: number;

  @Field(() => Boolean, { nullable: true })
  invite_only: boolean;

  @Field(() => String)
  image_url: string;
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
  streaming_url?: string;

  @Field(() => VenueType, { nullable: true })
  venue_type: VenueType;

  @Field(() => Date, { nullable: true })
  start_at: number;

  @Field(() => Date, { nullable: true })
  ends_at: number;

  @Field(() => Number, { nullable: true })
  capacity: number;

  @Field(() => Int, { nullable: true })
  venueId?: number;

  @Field(() => Boolean, { nullable: true })
  invite_only: boolean;

  @Field(() => String, { nullable: true })
  image_url: string;
}
