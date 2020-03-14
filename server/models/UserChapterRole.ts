import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Chapter } from './Chapter';

export type ChapterRoles = 'organizer' | 'member';

@Entity({ name: 'user_chapter_roles' })
export class UserChapterRole {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  chapter_id!: number;

  @PrimaryColumn({ type: 'text' })
  role_name!: ChapterRoles;

  @ManyToOne(_type => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(_type => Chapter)
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  constructor(params: {
    userId: number;
    roleName: ChapterRoles;
    chapterId: number;
  }) {
    if (params) {
      this.user_id = params.userId;
      this.role_name = params.roleName;
      this.chapter_id = params.chapterId;
    }
  }
}
