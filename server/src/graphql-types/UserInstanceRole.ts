import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

// TODO: Make this enum
export type InstanceRoles = 'admin' | 'owner';

// TODO: this should have the same structure as chapter roles
@ObjectType()
export class UserInstanceRole {
  @Field(() => Int)
  user_id: number;

  @Field(() => String)
  role_name: InstanceRoles;

  @Field(() => User)
  user: User;
}
