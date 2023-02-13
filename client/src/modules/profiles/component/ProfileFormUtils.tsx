import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { IsBoolean, IsString } from 'class-validator';
import { UpdateUserInputs } from '../../../generated/graphql';
import { IsOptionalUrl } from '../../util/form';

export interface ProfileFormProps {
  onSubmit: (data: UpdateUserInputs) => Promise<void>;
  data: UpdateUserInputs;
  submitText: string;
  loadingText: string;
}

type Fields = {
  key: keyof UpdateUserInputs;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
};

export class Profile {
  @IsString()
  name: string;

  @IsOptionalUrl()
  image_url: string;

  @IsBoolean()
  auto_subscribe: boolean;
}

export const resolver = classValidatorResolver(Profile);

export const fields: Fields[] = [
  {
    key: 'name',
    label: 'Name',
    placeholder: 'Add your name here',
    required: false,
    type: 'text',
  },
  {
    key: 'image_url',
    label: 'Profile Picture',
    placeholder: 'Add a link to a profile image here',
    required: false,
    type: 'url',
  },
];
