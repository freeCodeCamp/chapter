import { InputType, Field } from 'type-graphql';

import { Chapter } from '../../graphql-types';

@InputType()
export class ChapterInputs implements Omit<Chapter, 'id' | 'creator_id'> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  region: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  banner_url: string;

  @Field(() => String)
  logo_url: string;

  @Field(() => String, { nullable: true })
  chat_url?: string | null;

  @Field(() => [String])
  chapter_tags: string[];
}
