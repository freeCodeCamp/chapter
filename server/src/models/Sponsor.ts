import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { EventSponsor } from './EventSponsor';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'sponsors' })
export class Sponsor extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ nullable: false })
  website!: string;

  @Field(() => String)
  @Column({ nullable: false })
  logo_path!: string;

  @Field(() => String)
  @Column({ nullable: false })
  type!: string;

  @Field(() => [EventSponsor])
  @OneToMany((_type) => EventSponsor, (eventSponsor) => eventSponsor.event)
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
