import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateEventInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  video_url?: string;

  @Field(() => Date)
  start_at: number;

  @Field(() => Date)
  ends_at: number;

  @Field(() => Number)
  capacity: number;

  @Field(() => Int)
  venueId: number;

  @Field(() => Int)
  chapterId: number;
}

@InputType()
export class UpdateEventInputs {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  video_url?: string;

  @Field(() => Date, { nullable: true })
  start_at: number;

  @Field(() => Date, { nullable: true })
  ends_at: number;

  @Field(() => Number, { nullable: true })
  capacity: number;

  @Field(() => Int, { nullable: true })
  venueId: number;
}
