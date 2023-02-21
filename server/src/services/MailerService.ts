import { inspect } from 'util';

import type {
  MailerData,
  MailProvider,
} from './mail-providers/abstract-provider';
import { SendgridProvider } from './mail-providers/sendgrid';
import { SESProvider } from './mail-providers/ses';
import { SMTPProvider } from './mail-providers/smtp';

export interface BatchEmailData {
  email: string;
  subject: string;
  text: string;
  options?: object;
}

export class MailerService {
  private mailProvider: MailProvider;

  public constructor() {
    switch (process.env.EMAIL_SERVICE) {
      case 'ses':
        this.mailProvider = new SESProvider();
        break;
      case 'sendgrid':
        this.mailProvider = new SendgridProvider();
        break;
      default:
        this.mailProvider = new SMTPProvider();
    }
  }

  public async sendEmail(data: MailerData): Promise<void> {
    try {
      return await this.mailProvider.send(data);
    } catch (e) {
      // We need to inspect, since mail error objects are often quite deep.
      console.log('Email failed to send. ', inspect(e, false, null));
    }
  }
}

const mailerService = new MailerService();
export default mailerService;

export async function batchSender(
  mailData: () => Generator<BatchEmailData, void>,
) {
  const mails = [];
  for (const { email, subject, text, options } of mailData()) {
    mails.push(
      mailerService.sendEmail({
        emailList: [email],
        subject,
        htmlEmail: text,
        ...options,
      }),
    );
  }
  await Promise.all(mails);
}
