import { InputType, Field } from 'type-graphql';

@InputType()
export class SendEmailInputs {
  @Field(() => [String])
  to: string[];

  @Field(() => String)
  subject: string;

  @Field(() => String)
  html: string;
}
