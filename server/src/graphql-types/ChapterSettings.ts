import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class ChapterSettings extends BaseObject {
  @Field(() => String, { nullable: true })
  privacy_link: string | null;

  @Field(() => String, { nullable: true })
  terms_of_services_link: string | null;

  @Field(() => String, { nullable: true })
  code_of_conduct_link: string | null;
}
