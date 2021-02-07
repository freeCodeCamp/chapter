import { MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class SendEmailInputs {
  @Field(() => [String])
  // TODO create customm validator to verify that all emails are properly formatted
  // TODO create custom validator to verify that all emails belong to registered users
  // TODO create custom validator to check for duplicate emails
  to: string[];

  @Field()
  @MaxLength(100)
  subject: string;

  @Field()
  html: string;
}
