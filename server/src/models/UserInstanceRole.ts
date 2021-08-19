import { ObjectType, Field, Int } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

// TODO: Make this enum
export type InstanceRoles = 'admin' | 'owner';

@ObjectType()
@Entity({ name: 'user_instance_roles' })
export class UserInstanceRole {
  @Field(() => Int)
  @PrimaryColumn()
  user_id!: number;

  @Field(() => String)
  @PrimaryColumn({ type: 'text' })
  role_name!: InstanceRoles;

  @Field(() => User)
  @ManyToOne((_type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(params: { userId: number; roleName: InstanceRoles }) {
    if (params) {
      this.user_id = params.userId;
      this.role_name = params.roleName;
    }
  }
}
