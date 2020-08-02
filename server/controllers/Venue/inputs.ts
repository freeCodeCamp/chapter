import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateVenueInputs {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  street_address?: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  postal_code: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String, { nullable: true })
  latitude?: number;

  @Field(() => String, { nullable: true })
  longitude?: number;
}

@InputType()
export class UpdateVenueInputs {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  street_address?: string;

  @Field(() => String, { nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  postal_code: string;

  @Field(() => String, { nullable: true })
  region: string;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  latitude?: number;

  @Field(() => String, { nullable: true })
  longitude?: number;
}
