import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import type {
  VenueQuery,
  VenueInputs,
  ChapterQuery,
} from '../../../../generated/graphql';
import { IsNonEmptyString } from '../../../util/form';

export type VenueFormData = Required<VenueInputs> & { chapter_id: number };

export interface VenueFormProps {
  onSubmit: (data: VenueFormData) => Promise<void>;
  data?: VenueQuery;
  chapterData?: ChapterQuery;
  adminedChapters?: { name: string; id: number }[];
  submitText: string;
  chapterId?: number;
  loadingText: string;
}

// We could loop over the fields array to generate this, but we'd lose type
// safety by doing so.
export const getDefaultValues = (
  chapterId: number,
  venue?: VenueQuery['venue'],
) => ({
  chapter_id: chapterId,
  name: venue?.name ?? '',
  street_address: venue?.street_address ?? null,
  city: venue?.city ?? '',
  postal_code: venue?.postal_code ?? '',
  region: venue?.region ?? '',
  country: venue?.country ?? '',
  latitude: venue?.latitude ?? null,
  longitude: venue?.longitude ?? null,
});

export class Venue {
  @IsNotEmpty()
  chapter_id: number;

  @IsNonEmptyString()
  name: string;

  @IsOptional()
  @IsString()
  street_address?: string | null;

  @IsNonEmptyString()
  city: string;

  @IsNonEmptyString()
  postal_code: string;

  @IsNonEmptyString()
  region: string;

  @IsNonEmptyString()
  country: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number | null;

  @IsOptional()
  @IsLongitude()
  longitude?: number | null;
}

export const resolver = classValidatorResolver(Venue);

type Fields = {
  key: keyof VenueInputs;
  label: string;
  placeholder: string;
  isRequired: boolean;
  type: 'text' | 'number';
  max?: number;
  min?: number;
  step?: number;
};

export const fields: Fields[] = [
  {
    key: 'name',
    label: 'Venue name',
    placeholder: 'Venue name',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'street_address',
    label: 'Street address',
    placeholder: 'Street address',
    isRequired: false,
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'San Francisco',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    placeholder: '94501',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'Bay Area',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'United States of America',
    isRequired: true,
    type: 'text',
  },
  {
    key: 'latitude',
    label: 'Latitude',
    placeholder: '',
    isRequired: false,
    type: 'number',
    max: 90,
    min: -90,
    step: 0.01,
  },
  {
    key: 'longitude',
    label: 'Longitude',
    placeholder: '',
    isRequired: false,
    type: 'number',
    max: 180,
    min: -180,
    step: 0.001,
  },
];
