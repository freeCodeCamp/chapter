import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { IUser, IRsvp, IChapter, ISocialProvider } from 'types/models';
import { Rsvp } from './Rsvp';
import { Chapter } from './Chapter';
import { UserChapter } from './UserChapter';
import { SocialProvider } from './SocialProvider';
import { SocialProviderUser } from './SocialProviderUser';

@Table
export class User extends Model<IUser> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  first_name!: string;

  @Column
  last_name!: string;

  @Column
  email!: string;

  @Column
  password_digest!: string;

  @BelongsToMany(() => Chapter, () => UserChapter)
  chapters!: IChapter[];

  @BelongsToMany(() => SocialProvider, () => SocialProviderUser)
  social_providers: ISocialProvider[];

  @HasMany(() => Rsvp)
  rsvps: IRsvp[];

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
