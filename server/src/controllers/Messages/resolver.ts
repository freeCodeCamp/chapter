import { Resolver, Mutation, Arg } from 'type-graphql';

import mailerService from '../../services/MailerService';
import { Email } from './Email';
import { SendEmailInputs } from './inputs';

@Resolver()
export class EmailResolver {
  @Mutation(() => Email) async sendEmail(
    @Arg('data') data: SendEmailInputs,
  ): Promise<Email> {
    const email = await mailerService.sendEmail({
      emailList: data.to,
      subject: data.subject,
      htmlEmail: data.html,
    });

    return {
      ourEmail: email.ourEmail,
      emailList: email.emailList,
      subject: email.subject,
      htmlEmail: email.htmlEmail,
      backupText: email.backupText,
    };
  }
}
