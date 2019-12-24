import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Venue } from './Venue';
import { Chapter } from './Chapter';

@Entity({ name: 'locations' })
export class Location extends BaseModel {
  @Column({ nullable: false })
  country_code!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  region!: string;

  @Column({ nullable: false })
  postal_code!: string;

  @OneToMany(
    _type => Venue,
    venue => venue.location,
  )
  venues!: Venue[];

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
  }) {
    super();
    if (params) {
      const { country_code, city, region, postal_code } = params;

      this.country_code = country_code;
      this.city = city;
      this.region = region;
      this.postal_code = postal_code;
    }
  }
}
