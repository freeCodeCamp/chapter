import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { IsIn } from 'class-validator';
import { DashboardSponsorQuery, Sponsor } from 'generated/graphql';
import { IsNonEmptyString, IsOptionalUrl } from 'modules/util/form';

export type SponsorFormData = Omit<
  Sponsor,
  'id' | 'created_at' | 'updated_at' | 'events'
>;

export interface SponsorFormProps {
  onSubmit: (data: SponsorFormData) => Promise<void>;
  data?: DashboardSponsorQuery;
  submitText: string;
  loadingText: string;
}

export interface FormField {
  key: keyof Omit<SponsorFormData, '__typename'>;
  placeholder: string;
  label: string;
  isRequired: boolean;
}

export const sponsorTypes = [
  {
    id: 'FOOD',
    name: 'Food',
  },
  {
    id: 'VENUE',
    name: 'Venue',
  },
  {
    id: 'OTHER',
    name: 'Other',
  },
];

export class SponsorClass {
  @IsNonEmptyString()
  name: string;

  @IsOptionalUrl()
  website: string | null;

  @IsOptionalUrl()
  logo_path: string | null;

  @IsIn([...sponsorTypes.map((type) => type.id)])
  type: string;
}

export const resolver = classValidatorResolver(SponsorClass);

export const fields: FormField[] = [
  {
    key: 'name',
    placeholder: 'freecodecamp',
    label: 'Sponsor Name',
    isRequired: true,
  },
  {
    key: 'website',
    placeholder: 'www.freecodecamp.com',
    label: 'Website Url',
    isRequired: false,
  },
  {
    key: 'logo_path',
    placeholder: 'www.freecodecamp.com',
    label: 'Logo Path',
    isRequired: false,
  },
];
