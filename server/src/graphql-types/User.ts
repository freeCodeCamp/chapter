import { ObjectType, Field, Resolver, Root, FieldResolver } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class User extends BaseObject {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => String)
  email: string;
}

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => String)
  name(@Root() user: User) {
    return `${user.first_name} ${user.last_name}`;
  }
}
