import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateChapterInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  imageUrl: string;
}

@InputType()
export class UpdateChapterInputs {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => String, { nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  region: string;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;
}
