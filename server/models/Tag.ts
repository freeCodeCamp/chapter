import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';

@Entity({ name: 'tags' })
export class Tag extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @ManyToOne(
    _type => Event,
    event => event.tags,
  )
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  constructor(params: { name: string; event: Event }) {
    super();
    if (params) {
      const { name, event } = params;
      this.name = name;
      this.event = event;
    }
  }
}
