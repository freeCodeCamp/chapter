import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'tags' })
export class Tag extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => [Event])
  @ManyToMany((_type) => Event, (events) => events.tags, {
    onDelete: 'CASCADE',
  })
  events!: Event[];

  constructor(params: { name: string; events: Event[] }) {
    super();
    if (params) {
      const { name, events } = params;
      this.name = name;
      this.events = events;
    }
  }
}
