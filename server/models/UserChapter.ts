import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseModel } from './BaseModel';
import { User } from './User';
import { Chapter } from './Chapter';

@Entity({ name: 'user_chapters' })
export class UserChapter extends BaseModel {
  @ManyToOne(
    _type => User,
    user => user.chapters,
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(
    _type => Chapter,
    chapter => chapter.users,
  )
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  /*
    This indicates whether he use wants to receive notifications about this chapter.
    Defaults to True when the user joins this chapter
   */
  @Column({ nullable: false })
  interested: boolean;

  constructor(params: { user: User; chapter: Chapter; interested?: boolean }) {
    super();
    if (params) {
      const { user, chapter, interested = true } = params;
      this.user = user;
      this.chapter = chapter;
      this.interested = interested;
    }
  }
}
