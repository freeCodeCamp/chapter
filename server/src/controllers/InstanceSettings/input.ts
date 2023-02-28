import { Field, InputType } from 'type-graphql';
import { InstanceSettings } from '../../graphql-types/InstanceSettings';

@InputType()
export class UpdateInstanceSettingsInputs
  implements Omit<InstanceSettings, 'id'>
{
  @Field(() => String, { nullable: true })
  privacy_link: string;

  @Field(() => String, { nullable: true })
  terms_of_services_link: string;

  @Field(() => String, { nullable: true })
  code_of_conduct_link: string;
}
