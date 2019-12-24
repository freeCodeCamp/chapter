import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Location } from './Location';

@Entity({ name: 'venues' })
export class Venue extends BaseModel {
  @Column()
  name!: string;

  @OneToMany(
    _type => Event,
    event => event.venue,
  )
  events!: Event[];

  @ManyToOne(
    _type => Location,
    location => location.venues,
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
