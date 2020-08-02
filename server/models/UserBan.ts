import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { User } from './User';
import { Chapter } from './Chapter';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'user_bans' })
export class UserBan extends BaseModel {
  @Field(() => User)
  @ManyToOne(
    _type => User,
    user => user.banned_chapters,
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => Chapter)
  @ManyToOne(
    _type => Chapter,
    chapter => chapter.banned_users,
  )
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  constructor(params: { user: User; chapter: Chapter }) {
    super();
    if (params) {
      const { user, chapter } = params;
      this.user = user;
      this.chapter = chapter;
    }
  }
}
