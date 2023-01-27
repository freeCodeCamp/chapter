import { isURL, registerDecorator } from 'class-validator';

import { TextArea } from '../../components/Form/TextArea';
import { Input } from '../../components/Form/Input';

export const fieldTypeToComponent = (type: string) => {
  if (type === 'textarea') {
    return TextArea;
  }
  return Input;
};

export const IsNonEmptyString = () => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isNonEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} should be a non empty string`,
      },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length !== 0;
        },
      },
    });
  };
};

export const IsOptionalUrl = () => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isOptionalUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a URL address`,
      },
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }
          return isURL(value);
        },
      },
    });
  };
};
