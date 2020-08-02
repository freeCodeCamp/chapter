import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Location } from './Location';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ name: 'venues' })
export class Venue extends BaseModel {
  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => [Event])
  @OneToMany(
    _type => Event,
    event => event.venue,
  )
  events!: Event[];

  @Field(() => Location)
  @ManyToOne(
    _type => Location,
    location => location.venues,
    { nullable: false },
  )
  @JoinColumn({ name: 'location_id' })
  location!: Location;

  constructor(params: { name: string; location: Location }) {
    super();
    if (params) {
      const { name, location } = params;
      this.name = name;
      this.location = location;
    }
  }
}
