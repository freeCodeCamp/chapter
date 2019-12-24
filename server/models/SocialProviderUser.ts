import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { SocialProvider } from './SocialProvider';
import { User } from './User';

@Entity({ name: 'social_provider_users' })
export class SocialProviderUser extends BaseModel {
  @ManyToOne(
    _type => SocialProvider,
    socialProvider => socialProvider.users,
  )
  @JoinColumn({ name: 'provider_id' })
  social_provider!: SocialProvider;

  @ManyToOne(
    _type => User,
    user => user.social_providers,
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(params: { socialProvider: SocialProvider; user: User }) {
    super();
    if (params) {
      const { socialProvider, user } = params;
      this.social_provider = socialProvider;
      this.user = user;
    }
  }
}
