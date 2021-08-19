import { Resolver, Mutation, Arg } from 'type-graphql';
import { Email } from './Email';
import { SendEmailInputs } from './inputs';
import MailerService from 'src/services/MailerService';

@Resolver()
export class EmailResolver {
  @Mutation(() => Email) async sendEmail(@Arg('data') data: SendEmailInputs) {
    const email = new MailerService(data.to, data.subject, data.html);
    await email.sendEmail();
    return {
      ourEmail: email.ourEmail,
      emailList: email.emailList,
      subject: email.subject,
      htmlEmail: email.htmlEmail,
      backupText: email.backupText,
    };
  }
}
