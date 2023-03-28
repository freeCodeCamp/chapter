import { InputType, Field, Float } from 'type-graphql';

@InputType()
export class VenueInputs {
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

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field(() => [String])
  venue_tags: string[];
}
