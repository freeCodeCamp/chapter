import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateChapterInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  category: string;

  // details: any;
  @Field(() => Int)
  locationId: number;
}

@InputType()
export class UpdateChapterInputs {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  // details: any;
  @Field(() => Int, { nullable: true })
  locationId?: number;
}
