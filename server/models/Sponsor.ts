import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { EventSponsor } from './EventSponsor';

@Entity({ name: 'sponsors' })
export class Sponsor extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  website!: string;

  @Column({ nullable: false })
  logo_path!: string;

  @Column({ nullable: false })
  type!: string;

  @OneToMany(
    _type => EventSponsor,
    eventSponsor => eventSponsor.event,
  )
  events!: EventSponsor[];

  constructor(params: {
    name: string;
    website: string;
    logoPath: string;
    type: string;
  }) {
    super();
    if (params) {
      const { name, website, logoPath, type } = params;
      this.name = name;
      this.website = website;
      this.logo_path = logoPath;
      this.type = type;
    }
  }
}
