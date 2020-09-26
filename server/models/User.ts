import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Chapter } from './Chapter';
import { Rsvp } from './Rsvp';
import { UserBan } from './UserBan';
import { UserChapterRole } from './UserChapterRole';
import { UserInstanceRole } from './UserInstanceRole';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'users' })
export class User extends BaseModel {
  @Field(() => String)
  @Column()
  first_name!: string;

  @Field(() => String)
  @Column()
  last_name!: string;

  @Field(() => String)
  @Column()
  email!: string;

  @Field(() => String)
  @Column()
  google_id: string;

  @Field(() => String)
  @Column()
  google_picture: string;

  @Field(() => [Chapter])
  @OneToMany(
    _type => Chapter,
    chapter => chapter.creator,
  )
  created_chapters!: Chapter[];

  @Field(() => [Rsvp])
  @OneToMany(
    _type => Rsvp,
    rsvp => rsvp.user,
  )
  rsvps!: Rsvp[];

  @Field(() => [UserChapterRole])
  @OneToMany(
    _type => UserChapterRole,
    chapter => chapter.user,
  )
  chapters!: UserChapterRole[];

  @Field(() => [UserBan])
  @OneToMany(
    _type => UserBan,
    userBan => userBan.user,
  )
  banned_chapters!: UserBan[];

  @Field(() => [UserChapterRole])
  @OneToMany(
    _type => UserChapterRole,
    userChapterRole => userChapterRole.user,
  )
  chapter_roles!: UserChapterRole[];

  @Field(() => [UserInstanceRole])
  @OneToMany(
    _type => UserInstanceRole,
    userInstanceRole => userInstanceRole.user,
  )
  instance_roles!: UserInstanceRole[];

  constructor(params: {
    first_name: string;
    last_name: string;
    email: string;
    google_id?: string;
    google_picture?: string;
  }) {
    super();
    if (params) {
      const {
        first_name,
        last_name,
        email,
        google_id,
        google_picture,
      } = params;
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.google_id = google_id ? google_id : '';
      this.google_picture = google_picture ? google_picture : '';
    }
  }
}
