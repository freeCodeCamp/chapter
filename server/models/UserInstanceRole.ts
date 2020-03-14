import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

export type InstanceRoles = 'admin' | 'owner';

@Entity({ name: 'user_instance_roles' })
export class UserInstanceRole {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn({ type: 'text' })
  role_name!: InstanceRoles;

  @ManyToOne(_type => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(params: { userId: number; roleName: InstanceRoles }) {
    if (params) {
      this.user_id = params.userId;
      this.role_name = params.roleName;
    }
  }
}
