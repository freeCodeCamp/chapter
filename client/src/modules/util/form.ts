import { isURL, registerDecorator } from 'class-validator';

import { TextArea } from '../../components/Form/TextArea';
import { Input } from '../../components/Form/Input';

export const fieldTypeToComponent = (type: string) => {
  if (type === 'textarea') {
    return TextArea;
  }
  return Input;
};

const generateDecorator = (
  name: string,
  msgSuffix: string,
  runValidation: (value: any) => boolean | Promise<boolean>,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: name,
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} ${msgSuffix}`,
      },
      validator: {
        validate(value: any) {
          return runValidation(value);
        },
      },
    });
  };
};

const isNonEmptyString = (value: any) => {
  return typeof value === 'string' && value.trim().length !== 0;
};

export const IsNonEmptyString = () => {
  return generateDecorator(
    'isNonEmptyString',
    'should be a non empty string',
    isNonEmptyString,
  );
};

const isOptionalUrl = (value: any) => {
  if (!value) {
    return true;
  }
  return isURL(value);
};

export const IsOptionalUrl = () => {
  return generateDecorator(
    'isOptionalUrl',
    'must be a URL address',
    isOptionalUrl,
  );
};
