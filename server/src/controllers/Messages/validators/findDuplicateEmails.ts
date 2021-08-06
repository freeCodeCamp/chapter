import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class FindDuplicateEmailsConstraint
  implements ValidatorConstraintInterface
{
  validate(emailList: string[]) {
    const checkedEmails = {};
    for (let i = 0; i <= emailList.length; i++) {
      if (emailList[i] in checkedEmails) {
        return false;
      }
      checkedEmails[emailList[i]] = 1;
    }
    return true;
  }
}

export function FindDuplicateEmails(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: FindDuplicateEmailsConstraint,
    });
  };
}
