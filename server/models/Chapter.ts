import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Location } from './Location';
import { User } from './User';
import { UserChapter } from './UserChapter';
import { UserBan } from './UserBan';

@Entity({ name: 'chapters' })
export class Chapter extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  category!: string;

  @Column({ type: 'json' })
  details!: any;

  @OneToMany(
    _type => Event,
    event => event.chapter,
  )
  events!: Event[];

  @ManyToOne(
    _type => Location,
    location => location.chapters,
  )
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  @ManyToOne(
    _type => User,
    user => user.created_chapters,
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @OneToMany(
    _type => UserChapter,
    userChapter => userChapter.chapter,
  )
  users!: UserChapter[];

  @OneToMany(
    _type => UserBan,
    userBan => userBan.chapter,
  )
  banned_users!: UserBan[];

  constructor(params: {
    name: string;
    description: string;
    category: string;
    details: any;
    location?: Location;
    creator?: User;
  }) {
    super();
    if (params) {
      const {
        name,
        description,
        category,
        details,
        location,
        creator,
      } = params;

      this.name = name;
      this.description = description;
      this.category = category;
      this.details = details;
      location && (this.location = location);
      creator && (this.creator = creator);
    }
  }
}
