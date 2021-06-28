import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Chapter } from './Chapter';
import { Rsvp } from './Rsvp';
import { UserBan } from './UserBan';
import { UserChapterRole } from './UserChapterRole';
import { UserInstanceRole } from './UserInstanceRole';
import { ObjectType, Field, Resolver, Root, FieldResolver } from 'type-graphql';

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
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => [Chapter])
  @OneToMany((_type) => Chapter, (chapter) => chapter.creator)
  created_chapters!: Chapter[];

  @Field(() => [Rsvp])
  @OneToMany((_type) => Rsvp, (rsvp) => rsvp.user)
  rsvps!: Rsvp[];

  @Field(() => [UserChapterRole])
  @OneToMany((_type) => UserChapterRole, (chapter) => chapter.user)
  chapters!: UserChapterRole[];

  @Field(() => [UserBan])
  @OneToMany((_type) => UserBan, (userBan) => userBan.user)
  banned_chapters!: UserBan[];

  @Field(() => [UserChapterRole])
  @OneToMany(
    (_type) => UserChapterRole,
    (userChapterRole) => userChapterRole.user,
  )
  chapter_roles!: UserChapterRole[];

  @Field(() => [UserInstanceRole])
  @OneToMany(
    (_type) => UserInstanceRole,
    (userInstanceRole) => userInstanceRole.user,
  )
  instance_roles!: UserInstanceRole[];

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

@Resolver(() => User)
export class UserResolver {
  @FieldResolver()
  name(@Root() user: User) {
    return `${user.first_name} ${user.last_name}`;
  }
}
