import { ObjectType, Field } from 'type-graphql';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseJunctionModel } from './BaseJunctionModel';
import { Chapter } from './Chapter';
import { User } from './User';

@ObjectType()
@Entity({ name: 'user_bans' })
export class UserBan extends BaseJunctionModel {
  @Field(() => User)
  @ManyToOne((_type) => User, (user) => user.banned_chapters, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => Chapter)
  @ManyToOne((_type) => Chapter, (chapter) => chapter.banned_users, {
    primary: true,
  })
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
