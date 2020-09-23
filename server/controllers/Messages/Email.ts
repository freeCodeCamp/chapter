import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Email {
  @Field(() => String)
  to: string[];

  @Field(() => String)
  subject: string;

  @Field(() => String)
  html: string;
}
