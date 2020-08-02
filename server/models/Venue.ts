import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Field, ObjectType, Float } from 'type-graphql';

interface IVenueProps {
  name: string;
  events?: Event[];
  street_address?: string;
  city: string;
  postal_code: string;
  region: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  street_address?: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => String)
  @Column()
  postal_code: string;

  @Field(() => String)
  @Column()
  region: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  longitude?: number;

  constructor(params: IVenueProps) {
    super();
    if (params) {
      this.name = params.name;
      this.name = params.name;
      this.events = params.events || [];
      this.street_address = params.street_address;
      this.city = params.city;
      this.postal_code = params.postal_code;
      this.region = params.region;
      this.country = params.country;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
    }
  }
}
