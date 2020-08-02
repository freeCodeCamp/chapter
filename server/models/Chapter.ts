import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Location } from './Location';
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

  @Field(() => [Event])
  @OneToMany(
    _type => Event,
    event => event.chapter,
  )
  events!: Event[];

  @Field(() => Location)
  @ManyToOne(
    _type => Location,
    location => location.chapters,
  )
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @Field(() => User)
  @ManyToOne(
    _type => User,
    user => user.created_chapters,
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @Field(() => [UserChapterRole])
  @OneToMany(
    _type => UserChapterRole,
    UserChapterRole => UserChapterRole.chapter,
  )
  users!: UserChapterRole[];

  @Field(() => [UserBan])
  @OneToMany(
    _type => UserBan,
    userBan => userBan.chapter,
  )
  banned_users!: UserBan[];

  constructor(params: {
    name: string;
    description: string;
    category: string;
    // details: any;
    location?: Location;
    creator?: User;
  }) {
    super();
    if (params) {
      const {
        name,
        description,
        category,
        // details,
        location,
        creator,
      } = params;

      this.name = name;
      this.description = description;
      this.category = category;
      // this.details = details;
      location && (this.location = location);
      creator && (this.creator = creator);
    }
  }
}
