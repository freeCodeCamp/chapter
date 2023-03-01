import { Field, InputType } from 'type-graphql';
import { InstanceSettings } from '../../graphql-types/InstanceSettings';

@InputType()
export class InstanceSettingsInputs implements Omit<InstanceSettings, 'id'> {
  @Field(() => String, { nullable: true })
  policy_url: string;

  @Field(() => String, { nullable: true })
  terms_of_services_url: string;

  @Field(() => String, { nullable: true })
  code_of_conduct_url: string;
}
