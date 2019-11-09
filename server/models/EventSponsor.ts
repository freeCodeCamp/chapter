import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { IEventSponsor } from 'types/models';

@Table
export class EventSponsor extends Model<IEventSponsor> {
  @PrimaryKey
  @Column
  eventId: number;

  @Column
  sponsorId: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
