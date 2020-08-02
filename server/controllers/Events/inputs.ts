import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateEventInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int) // pass UTC number
  start_at: Date;

  @Field(() => Int) // pass UTC number
  ends_at: Date;

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

  @Field(() => Int, { nullable: true }) // pass UTC number
  start_at: Date;

  @Field(() => Int, { nullable: true }) // pass UTC number
  ends_at: Date;

  @Field(() => Number, { nullable: true })
  capacity: number;

  @Field(() => Int, { nullable: true })
  venueId: number;
}
