import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { User } from './User';
import { Chapter } from './Chapter';
import { BaseModel } from './BaseModel';

export type ChapterRoles = 'organizer' | 'member';

@Entity({ name: 'user_chapter_roles' })
export class UserChapterRole extends BaseModel {
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

  /*
    This indicates whether he use wants to receive notifications about this chapter.
    Defaults to True when the user joins this chapter
   */
  @Column({ nullable: false })
  interested: boolean;

  constructor(params: {
    userId: number;
    roleName: ChapterRoles;
    chapterId: number;
    interested?: boolean;
  }) {
    super();
    if (params) {
      this.user_id = params.userId;
      this.role_name = params.roleName;
      this.chapter_id = params.chapterId;
      this.interested = params.interested || true;
    }
  }
}
