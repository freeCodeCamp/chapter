import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class InstanceSettings extends BaseObject {
  @Field(() => String, { nullable: true })
  policy_url: string | null;

  @Field(() => String, { nullable: true })
  terms_of_services_url: string | null;

  @Field(() => String, { nullable: true })
  code_of_conduct_url: string | null;
}
