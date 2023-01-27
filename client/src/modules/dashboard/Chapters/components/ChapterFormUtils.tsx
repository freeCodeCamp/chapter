import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { IsString } from 'class-validator';
import {
  DashboardChapterQuery,
  CreateChapterInputs,
} from '../../../../generated/graphql';
import { IsNonEmptyString, IsOptionalUrl } from '../../../util/form';

export interface ChapterFormProps {
  onSubmit: (data: CreateChapterInputs) => Promise<void>;
  data?: DashboardChapterQuery;
  submitText: string;
  loadingText: string;
}

type Fields = {
  key: keyof CreateChapterInputs;
  placeholder: string;
  label: string;
  required: boolean;
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
}

export const resolver = classValidatorResolver(Chapter);

export const fields: Fields[] = [
  {
    key: 'name',
    label: 'Chapter name',
    placeholder: 'freeCodeCamp',
    required: true,
    type: 'text',
  },
  {
    key: 'description',
    label: 'Description',
    placeholder:
      'freeCodeCamp is a nonprofit organization that helps people learn to code for free',
    required: true,
    type: 'textarea',
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'San Francisco',
    required: false,
    type: 'text',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'California',
    required: false,
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'United States of America',
    required: false,
    type: 'text',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Education and nonprofit work',
    required: true,
    type: 'text',
  },
  {
    key: 'banner_url',
    label: 'Banner Url',
    placeholder: 'https://www.freecodecamp.org',
    required: false,
    type: 'url',
  },
  {
    key: 'logo_url',
    label: 'Logo Url',
    placeholder: 'https://www.freecodecamplogo.org',
    required: false,
    type: 'url',
  },
  {
    key: 'chat_url',
    label: 'Chat link',
    placeholder: 'https://discord.gg/KVUmVXA',
    required: false,
    type: 'url',
  },
];
