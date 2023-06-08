import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { IsOptional, IsString } from 'class-validator';
import { parseTags } from '../../../../util/tags';
import {
  DashboardChapterQuery,
  ChapterInputs,
} from '../../../../generated/graphql';
import { IsNonEmptyString, IsOptionalUrl } from '../../../util/form';

export type ChapterFormData = Required<Omit<ChapterInputs, 'chapter_tags'>> & {
  chapter_tags: string;
};

export interface ChapterFormProps {
  onSubmit: (data: ChapterFormData) => Promise<void>;
  data?: DashboardChapterQuery;
  submitText: string;
  loadingText: string;
}

type Field = {
  key: keyof ChapterFormData;
  isRequired: boolean;
  label: string;
  placeholder: string;
  type: string;
};

export const getDefaultValues = (
  chapter: DashboardChapterQuery['dashboardChapter'] | undefined,
) => ({
  name: chapter?.name ?? '',
  description: chapter?.description ?? '',
  city: chapter?.city ?? '',
  region: chapter?.region ?? '',
  country: chapter?.country ?? '',
  category: chapter?.category ?? '',
  logo_url: chapter?.logo_url ?? '',
  banner_url: chapter?.banner_url ?? '',
  chat_url: chapter?.chat_url ?? '',
  chapter_tags: (chapter?.chapter_tags || [])
    .map(({ tag: { name } }) => name)
    .join(', '),
});

export class Chapter {
  @IsNonEmptyString()
  name: string;

  @IsNonEmptyString()
  description: string;

  @IsNonEmptyString()
  category: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  country: string;

  @IsOptionalUrl()
  banner_url?: string | null;

  @IsOptionalUrl()
  logo_url?: string | null;

  @IsOptionalUrl()
  chat_url?: string | null;

  @IsOptional()
  chapter_tags: string;
}

export const resolver = classValidatorResolver(Chapter);

export const fields: Field[] = [
  {
    key: 'name',
    label: 'Chapter name',
    placeholder: 'freeCodeCamp',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'description',
    label: 'Description',
    placeholder:
      'freeCodeCamp is a nonprofit organization that helps people learn to code for free',
    isRequired: true,
    type: 'textarea',
  },
  {
    key: 'chapter_tags',
    type: 'text',
    label: 'Tags (separated by a comma)',
    placeholder: 'NextJs, TypeScript',
    isRequired: false,
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'San Francisco',
    isRequired: false,
    type: 'text',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'California',
    isRequired: false,
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'United States of America',
    isRequired: false,
    type: 'text',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Education and nonprofit work',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'banner_url',
    label: 'Banner Url',
    placeholder: 'https://www.freecodecamp.org',
    isRequired: false,
    type: 'url',
  },
  {
    key: 'logo_url',
    label: 'Logo Url',
    placeholder: 'https://www.freecodecamplogo.org',
    isRequired: false,
    type: 'url',
  },
  {
    key: 'chat_url',
    label: 'Chat link',
    placeholder: 'https://discord.gg/KVUmVXA',
    isRequired: false,
    type: 'url',
  },
];

export const parseChapterData = (data: ChapterFormData) => {
  const { chapter_tags, ...rest } = data;
  return {
    ...rest,
    chapter_tags: parseTags(chapter_tags),
  };
};
