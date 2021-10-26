import { ObjectType, Field } from 'type-graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { EventSponsor } from './EventSponsor';

@ObjectType()
@Entity({ name: 'sponsors' })
export class Sponsor extends BaseModel {
  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  website!: string;

  @Field(() => String)
  @Column()
  logo_path!: string;

  @Field(() => String)
  @Column()
  type!: string;

  @Field(() => [EventSponsor])
  @OneToMany((_type) => EventSponsor, (events) => events.event)
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
