import { inspect } from 'util';

import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

import Utilities from '../util/Utilities';

export interface MailerData {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText?: string;
  iCalEvent?: string;
}

function btoa(str: string): string {
  return Buffer.from(str).toString('base64');
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
  sendgridKey: string;
  sendgridEmail: string;

  private _sendEmail: (data: MailerData) => Promise<SentMessageInfo>;

  // eslint-disable-next-line no-use-before-define

  public constructor() {
    // to be replaced with env vars
    this.ourEmail = process.env.CHAPTER_EMAIL || 'ourEmail@placeholder.place';
    this.emailUsername = process.env.EMAIL_USERNAME || 'project.1';
    this.emailPassword = process.env.EMAIL_PASSWORD || 'secret.1';
    this.emailService = process.env.EMAIL_SERVICE;
    this.emailHost = process.env.EMAIL_HOST || 'localhost';

    if (!process.env.SENDGRID_KEY || !process.env.SENDGRID_EMAIL) {
      this.createTransporter();
      this._sendEmail = this.sendViaNodemailer;
    } else {
      this.sendgridKey = process.env.SENDGRID_KEY;
      this.sendgridEmail = process.env.SENDGRID_EMAIL;
      sendgrid.setApiKey(this.sendgridKey);
      this._sendEmail = this.sendViaSendgrid;
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

  private async sendViaSendgrid(data: MailerData) {
    const attachment = data.iCalEvent
      ? {
          filename: 'calendar.ics',
          name: 'calendar.ics',
          content: btoa(data.iCalEvent),
          disposition: 'attachment',
          type: 'text/calendar; method=REQUEST',
        }
      : null;
    for (const email of data.emailList) {
      const baseOpts: MailDataRequired = {
        to: email,
        from: this.sendgridEmail,
        subject: data.subject,
        html: data.htmlEmail || data.backupText || '',
        trackingSettings: {
          clickTracking: {
            enable: false,
            enableText: false,
          },
          openTracking: {
            enable: false,
          },
          subscriptionTracking: {
            enable: false,
          },
        },
      };

      const opts: MailDataRequired = {
        ...baseOpts,
        ...(attachment && { attachments: [attachment] }),
      };
      await sendgrid.send(opts);
    }
  }

  private async sendViaNodemailer(data: MailerData) {
    const calendarEvent = data.iCalEvent
      ? {
          icalEvent: {
            filename: 'calendar.ics',
            content: data.iCalEvent,
          },
        }
      : null;
    return await this.transporter.sendMail({
      from: this.ourEmail,
      bcc: data.emailList,
      subject: data.subject,
      text: data.backupText,
      html: data.htmlEmail,
      ...calendarEvent,
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
