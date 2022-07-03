import { InputType, Field, ObjectType } from 'type-graphql';

import { UserWithInstanceRole } from '../../graphql-types';

@InputType()
export class RegisterInput {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => String)
  email: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;
}

@ObjectType()
export class LoginType {
  @Field(() => String)
  code: string;
}

@ObjectType()
export class AuthenticateType {
  @Field(() => String)
  token: string;

  @Field(() => UserWithInstanceRole)
  user: UserWithInstanceRole;
}
