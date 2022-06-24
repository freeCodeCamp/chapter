import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class InstancePermission {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class InstanceRolePermission {
  @Field(() => InstancePermission)
  instance_permission: InstancePermission;
}

@ObjectType()
export class InstanceRole {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [InstanceRolePermission])
  instance_role_permissions: InstanceRolePermission[];
}
