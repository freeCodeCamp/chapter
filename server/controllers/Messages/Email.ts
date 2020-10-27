import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Email {
  @Field(() => String)
  ourEmail: string;

  @Field(() => [String])
  emailList: string[];

  @Field(() => String)
  subject: string;

  @Field(() => String)
  htmlEmail: string;

  @Field(() => String)
  backupText: string;
}
