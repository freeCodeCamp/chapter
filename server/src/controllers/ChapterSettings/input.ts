import { Field, InputType } from 'type-graphql';
import { ChapterSettings } from '../../graphql-types/ChapterSettings';

@InputType()
export class UpdateChapterSettingsInputs
  implements Omit<ChapterSettings, 'id'>
{
  @Field(() => String, { nullable: true })
  privacy_link: string;

  @Field(() => String, { nullable: true })
  terms_of_services_link: string;

  @Field(() => String, { nullable: true })
  code_of_conduct_link: string;
}
