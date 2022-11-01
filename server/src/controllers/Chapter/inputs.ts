import { InputType, Field } from 'type-graphql';

import { Chapter } from '../../graphql-types';

@InputType()
export class CreateChapterInputs implements Omit<Chapter, 'id' | 'creator_id'> {
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
}

@InputType()
export class UpdateChapterInputs implements Omit<Chapter, 'id' | 'creator_id'> {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => String, { nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  region: string;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  banner_url: string;

  @Field(() => String, { nullable: true })
  logo_url: string;

  @Field(() => String, { nullable: true })
  chat_url?: string | null;
}
