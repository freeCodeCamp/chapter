import { Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class SendEmailInputs {
  @Field(() => [String])
  to: String;

  @Field()
  @Length(1, 255)
  subject: string;

  @Field()
  html: string;
}
