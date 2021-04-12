import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { User } from './User';
import { UserChapterRole } from './UserChapterRole';
import { UserBan } from './UserBan';

@ObjectType()
@Entity({ name: 'chapters' })
export class Chapter extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ nullable: false })
  description!: string;

  @Field(() => String)
  @Column({ nullable: false })
  category!: string;

  // TODO: Fix this
  @Field(() => String)
  @Column({ type: 'json' })
  details!: any;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  region: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => [Event])
  @OneToMany((_type) => Event, (event) => event.chapter)
  events!: Event[];

  @Field(() => User)
  @ManyToOne((_type) => User, (user) => user.created_chapters)
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @Field(() => [UserChapterRole])
  @OneToMany(
    (_type) => UserChapterRole,
    (UserChapterRole) => UserChapterRole.chapter,
  )
  users!: UserChapterRole[];

  @Field(() => [UserBan])
  @OneToMany((_type) => UserBan, (userBan) => userBan.chapter)
  banned_users!: UserBan[];

  constructor(params: {
    name: string;
    description: string;
    category: string;
    details?: any;
    city: string;
    region: string;
    country: string;
    creator?: User;
  }) {
    super();
    if (params) {
      const { creator } = params;

      this.name = params.name;
      this.description = params.description;
      this.category = params.category;
      this.details = params.details;
      this.city = params.city;
      this.region = params.region;
      this.country = params.country;
      creator && (this.creator = creator);
    }
  }
}
