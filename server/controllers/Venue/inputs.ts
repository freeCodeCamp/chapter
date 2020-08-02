import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateVenueInputs {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  locationId: number;
}

@InputType()
export class UpdateVenueInputs {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  locationId?: number;
}
