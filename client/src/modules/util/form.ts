import {
  isURL,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

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

const generateDateCompareDecorator = (
  name: string,
  runValidation: (
    value: any,
    args: ValidationArguments,
  ) => boolean | Promise<boolean>,
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: name,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return runValidation(value, args);
        },
      },
    });
  };
};

const isDateBefore = (value: any, args: ValidationArguments) => {
  const [otherProperty] = args.constraints;
  const otherValue = (args.object as any)[otherProperty];
  return (
    value instanceof Date && otherValue instanceof Date && value < otherValue
  );
};

export const IsDateBefore = (
  property: string,
  validationOptions: ValidationOptions,
) => {
  return generateDateCompareDecorator(
    'isDateBefore',
    isDateBefore,
    property,
    validationOptions,
  );
};

const isDateAfter = (value: any, args: ValidationArguments) => {
  const [otherProperty] = args.constraints;
  const otherValue = (args.object as any)[otherProperty];
  return (
    value instanceof Date && otherValue instanceof Date && value > otherValue
  );
};

export const IsDateAfter = (
  property: string,
  validationOptions: ValidationOptions,
) => {
  return generateDateCompareDecorator(
    'isDateAfter',
    isDateAfter,
    property,
    validationOptions,
  );
};
