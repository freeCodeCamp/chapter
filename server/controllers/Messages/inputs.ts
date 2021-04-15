import { IsEmail, MaxLength } from 'class-validator';
import { IsListEmpty } from './validators/isListEmpty';
import { FindDuplicateEmails } from './validators/findDuplicateEmails';
import { InputType, Field } from 'type-graphql';

// @TODO create custom validator to verify all emails belong to registered users
// @TODO create custom validator to verify user sending email is authenticated

@InputType()
export class SendEmailInputs {
  @Field(() => [String])
  @IsListEmpty({ message: 'email list cannot be empty' })
  @IsEmail(undefined, { message: 'list contains invalid email', each: true })
  @FindDuplicateEmails({
    message: 'list contains one or more duplicate emails',
  })
  to: string[];

  @Field()
  @MaxLength(998)
  subject: string;

  @Field()
  html: string;
}
