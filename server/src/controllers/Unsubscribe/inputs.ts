import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UnsubscribeType {
  @Field(() => String)
  token: string;
}
