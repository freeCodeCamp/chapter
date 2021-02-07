import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsListEmptyConstraint implements ValidatorConstraintInterface {
  validate(emailList: any) {
    return emailList.length === 0 ? false : true;
  }
}

export function IsListEmpty(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsListEmptyConstraint,
    });
  };
}
