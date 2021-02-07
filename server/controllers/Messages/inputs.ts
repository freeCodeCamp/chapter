// import { MaxLength } from 'class-validator';
import { MaxLength } from 'class-validator';
import { IsListEmpty } from './isListEmpty';
import { InputType, Field } from 'type-graphql';

@InputType()
export class SendEmailInputs {
  @Field(() => [String])
  @IsListEmpty({ message: 'email list cannot be empty' })
  // TODO create customm validator to verify that all emails are properly formatted
  // TODO create custom validator to verify that all emails belong to registered users
  // TODO create custom validator to check for duplicate emails
  to: [];

  @Field()
  @MaxLength(10)
  subject: string;

  @Field()
  html: string;
}
