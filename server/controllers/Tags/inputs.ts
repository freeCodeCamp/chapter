import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class CreateTagInputs {
  @Field(() => String)
  name: string;

  @Field(() => [ID])
  eventIds!: string[];
}
