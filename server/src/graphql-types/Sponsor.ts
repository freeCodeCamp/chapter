import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { SponserChapterEvents } from './SponserChapterEvents';

@ObjectType()
export class Sponsor extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  website: string;

  @Field(() => String)
  logo_path: string;

  @Field(() => String)
  type: string;

  @Field(() => SponserChapterEvents)
  event_sponsors: SponserChapterEvents;
}
