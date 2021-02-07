import { Resolver, Mutation, Arg } from 'type-graphql';
import MailerService from '../../services/MailerService';
import { SendEmailInputs } from './inputs';
import { Email } from './Email';

@Resolver()
export class EmailResolver {
  @Mutation(() => Email) async sendEmail(@Arg('data') data: SendEmailInputs) {
    const email = new MailerService(data.to, data.subject, data.html);

    console.log('Sending email');
    await email.sendEmail();
    console.log('Email has been sent');
    return {
      ourEmail: email.ourEmail,
      emailList: email.emailList,
      subject: email.subject,
      htmlEmail: email.htmlEmail,
      backupText: email.backupText,
    };
  }
}
