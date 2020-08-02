import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Venue } from './Venue';
import { Chapter } from './Chapter';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity({ name: 'locations' })
export class Location extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  country_code!: string;

  @Field(() => String)
  @Column({ nullable: false })
  city!: string;

  @Field(() => String)
  @Column({ nullable: false })
  region!: string;

  @Field(() => String)
  @Column({ nullable: false })
  postal_code!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field(() => [Venue])
  @OneToMany(
    _type => Venue,
    venue => venue.location,
  )
  venues!: Venue[];

  @Field(() => [Chapter])
  @OneToMany(
    _type => Chapter,
    chapter => chapter.location,
  )
  chapters!: Chapter[];

  constructor(params: {
    country_code: string;
    city: string;
    region: string;
    postal_code: string;
    address?: string;
  }) {
    super();
    if (params) {
      const { country_code, city, region, postal_code, address } = params;

      this.address = address;
      this.country_code = country_code;
      this.city = city;
      this.region = region;
      this.postal_code = postal_code;
    }
  }
}
