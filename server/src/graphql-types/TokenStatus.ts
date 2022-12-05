import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class TokenStatus {
  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  is_valid: boolean;
}
