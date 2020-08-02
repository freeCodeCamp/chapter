import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateLocationInputs {
  @Field(() => String)
  country_code: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  postal_code: string;

  @Field(() => String, { nullable: true })
  address?: string;
}

@InputType()
export class UpdateLocationInputs {
  @Field(() => String, { nullable: true })
  country_code?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  region?: string;

  @Field(() => String, { nullable: true })
  postal_code?: string;

  @Field(() => String, { nullable: true })
  address?: string;
}
