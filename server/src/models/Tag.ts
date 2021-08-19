import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'tags' })
export class Tag extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => Event)
  @ManyToOne((_type) => Event, (event) => event.tags, { onDelete: 'CASCADE' })
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
