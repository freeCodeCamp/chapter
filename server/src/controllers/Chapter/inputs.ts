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

  @Field(() => [String])
  tags: string[];

  @Field(() => String)
  imageUrl: string;

  @Field(() => String, { nullable: true })
  chatUrl?: string | null;
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

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => String, { nullable: true })
  chatUrl?: string | null;
}
