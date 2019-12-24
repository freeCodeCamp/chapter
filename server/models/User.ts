import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { SocialProviderUser } from './SocialProviderUser';
import { Chapter } from './Chapter';
import { Rsvp } from './Rsvp';
import { UserChapter } from './UserChapter';
import { UserBan } from './UserBan';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  password_digest?: string;

  @OneToMany(
    _type => SocialProviderUser,
    socialProviderUser => socialProviderUser.user,
  )
  social_providers!: SocialProviderUser[];

  @OneToMany(
    _type => Chapter,
    chapter => chapter.creator,
  )
  created_chapters!: Chapter[];

  @OneToMany(
    _type => Rsvp,
    rsvp => rsvp.user,
  )
  rsvps!: Rsvp[];

  @OneToMany(
    _type => UserChapter,
    chapter => chapter.user,
  )
  chapters!: UserChapter[];

  @OneToMany(
    _type => UserBan,
    userBan => userBan.user,
  )
  banned_chapters!: UserBan[];

  constructor(params: {
    first_name: string;
    last_name: string;
    email: string;
  }) {
    super();
    if (params) {
      const { first_name, last_name, email } = params;
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
    }
  }
}
