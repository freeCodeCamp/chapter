import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { SocialProviderUser } from './SocialProviderUser';

@Entity({ name: 'social_providers' })
export class SocialProvider extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @OneToMany(
    _type => SocialProviderUser,
    socialProviderUser => socialProviderUser.social_provider,
  )
  users!: SocialProviderUser[];

  constructor(params: { name: string }) {
    super();
    if (params) {
      const { name } = params;
      this.name = name;
    }
  }
}
