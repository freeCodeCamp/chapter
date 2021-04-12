import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsListEmptyConstraint implements ValidatorConstraintInterface {
  validate(emailList: string[]) {
    return emailList.length !== 0;
  }
}

export function IsListEmpty(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsListEmptyConstraint,
    });
  };
}
