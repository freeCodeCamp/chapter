import { inspect } from 'util';

import AWS from 'aws-sdk';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

import Utilities from '../util/Utilities';

export interface MailerData {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText?: string;
}

// @todo add ourEmail, emailUsername, emailPassword, and emailService as
// environment variables when they become available. Temporary placeholders
// provided until updated info available.
export class MailerService {
  transporter: Transporter;
  ourEmail: string;
  emailUsername?: string;
  emailPassword?: string;
  emailService?: string;
  emailHost?: string;
  accessKeyId: string;
  secretAccessKey: string;

  private _sendEmail: (data: MailerData) => Promise<SentMessageInfo>;

  public constructor() {
    // to be replaced with env vars
    this.ourEmail = process.env.CHAPTER_EMAIL || 'ourEmail@placeholder.place';
    this.emailUsername = process.env.EMAIL_USERNAME || 'project.1';
    this.emailPassword = process.env.EMAIL_PASSWORD || 'secret.1';
    this.emailService = process.env.EMAIL_SERVICE;
    this.emailHost = process.env.EMAIL_HOST || 'localhost';

    if (!process.env.SES_ACCESS_KEY_ID || !process.env.SES_SECRET_ACCESS_KEY) {
      this.createTransporter();
      this._sendEmail = this.sendViaNodemailer;
    } else {
      this.accessKeyId = process.env.SES_ACCESS_KEY_ID;
      this.secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
      this._sendEmail = this.sendViaSES;
    }
  }

  private createTransporter() {
    const validateOurCredentials = Utilities.allValuesAreDefined([
      this.emailUsername,
      this.emailPassword,
      this.emailService,
      this.ourEmail,
    ]);

    if (!validateOurCredentials) {
      console.warn(
        'Email, Username, password, and/or email service are missing in Mailer.ts',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: this.emailService,
      host: this.emailHost,
      port: 1025,
      auth: {
        user: this.emailUsername,
        pass: this.emailPassword,
      },
    });
  }

  public async sendEmail(data: MailerData): Promise<SentMessageInfo> {
    try {
      return await this._sendEmail(data);
    } catch (e) {
      // We need to inspect, since mail error objects are often quite deep.
      console.log('Email failed to send. ', inspect(e, false, null));
    }
  }

  private async sendViaSES(data: MailerData) {
    const awsConfig = new AWS.Config({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: 'us-east-1',
    });
    for (const email of data.emailList) {
      const opts: AWS.SES.Types.SendEmailRequest = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: data.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: data.htmlEmail || data.backupText || '',
            },
          },
        },
        Source: this.ourEmail,
      };

      await new AWS.SES(awsConfig).sendEmail(opts).promise();
    }
  }

  private async sendViaNodemailer(data: MailerData) {
    return await this.transporter.sendMail({
      from: this.ourEmail,
      bcc: data.emailList,
      subject: data.subject,
      text: data.backupText,
      html: data.htmlEmail,
    });
  }
}

export interface BatchEmailData {
  email: string;
  subject: string;
  text: string;
  options?: object;
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
