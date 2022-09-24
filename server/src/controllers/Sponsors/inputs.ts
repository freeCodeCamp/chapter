import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateSponsorInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  website: string;

  @Field(() => String)
  logo_path: string;

  @Field(() => String)
  type: string;

  @Field(() => [Event])
  event: Event[];
}

@InputType()
export class UpdateSponsorInputs {
  @Field(() => String)
  name: string;

  @Field(() => String)
  website: string;

  @Field(() => String)
  logo_path: string;

  @Field(() => String)
  type: string;

  @Field(() => [Event])
  event: Event[];
}
