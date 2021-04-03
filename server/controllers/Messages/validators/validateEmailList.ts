import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class ValidateEmailListConstraint
  implements ValidatorConstraintInterface {
  validate(emailList: string[]) {
    const regex = /^[\w.%+\-]+@[\w.\-]+\.[A-Za-z]{2,6}$/;
    for (let i = 0; i < emailList.length; i++) {
      if (!regex.test(emailList[i])) return false;
    }
    return true;
  }
}

export function ValidateEmailList(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateEmailListConstraint,
    });
  };
}
