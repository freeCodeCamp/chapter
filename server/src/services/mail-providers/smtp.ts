import nodemailer, { Transporter } from 'nodemailer';

import type { MailerData } from './abstract-provider';
import { MailProvider } from './abstract-provider';
import { allValuesAreDefined } from './smtp-helpers';

export class SMTPProvider extends MailProvider {
  private transporter: Transporter;
  private emailUsername: string;
  private emailPassword: string;
  private emailHost: string;

  constructor() {
    super();
    const credentialsAreValid = allValuesAreDefined([
      process.env.EMAIL_USERNAME,
      process.env.EMAIL_PASSWORD,
      process.env.EMAIL_HOST,
      this.ourEmail,
    ]);

    if (!credentialsAreValid) {
      console.warn(
        'Email, Username, password, and/or email service are missing in Mailer.ts',
      );
    }
    this.emailUsername = process.env.EMAIL_USERNAME || 'project.1';
    this.emailPassword = process.env.EMAIL_PASSWORD || 'secret.1';
    this.emailHost = process.env.EMAIL_HOST || 'localhost';
    this.createTransporter();
  }

  private createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.emailHost,
      port: 1025,
      auth: {
        user: this.emailUsername,
        pass: this.emailPassword,
      },
    });
  }

  async send(data: MailerData) {
    return await this.transporter.sendMail({
      from: this.ourEmail,
      bcc: data.emailList,
      subject: data.subject,
      text: data.backupText,
      html: data.htmlEmail,
    });
  }
}
