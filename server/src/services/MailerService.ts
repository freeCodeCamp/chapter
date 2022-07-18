import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

import Utilities from '../util/Utilities';

export interface MailerData {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText?: string;
  iCalEvent?: string;
}

// @todo add ourEmail, emailUsername, emailPassword, and emailService as
// environment variables when they become available. Temporary placeholders
// provided until updated info available.
export default class MailerService {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText: string;
  transporter: Transporter;
  ourEmail: string;
  emailUsername: string;
  emailPassword: string;
  emailService: string;
  emailHost: string;
  iCalEvent?: string;

  constructor(data: MailerData) {
    this.emailList = data.emailList;
    this.subject = data.subject;
    this.htmlEmail = data.htmlEmail;
    this.backupText = data.backupText || '';
    this.iCalEvent = data.iCalEvent;

    // to be replaced with env vars
    this.ourEmail =
      (process.env.CHAPTER_EMAIL as string) || 'ourEmail@placeholder.place';
    this.emailUsername = (process.env.EMAIL_USERNAME as string) || 'project.1';
    this.emailPassword = (process.env.EMAIL_PASSWORD as string) || 'secret.1';
    this.emailService = process.env.EMAIL_SERVICE as string;
    this.emailHost = process.env.EMAIL_HOST || 'localhost';

    this.createTransporter();
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

  public async sendEmail(): Promise<SentMessageInfo> {
    try {
      const calendarEvent = this.iCalEvent
        ? {
            icalEvent: {
              filename: 'calendar.ics',
              content: this.iCalEvent,
            },
          }
        : {};
      return await this.transporter.sendMail({
        from: this.ourEmail,
        bcc: this.emailList,
        subject: this.subject,
        text: this.backupText,
        html: this.htmlEmail,
        ...calendarEvent,
      });
    } catch (e) {
      console.log('Email failed to send. ', e);
    }
  }
}

export interface BatchEmailData {
  email: string;
  subject: string;
  text: string;
  options?: object;
}

export async function batchSender(
  mailData: () => Generator<BatchEmailData, void>,
) {
  const mails = [];
  for (const { email, subject, text, options } of mailData()) {
    mails.push(
      new MailerService({
        emailList: [email],
        subject,
        htmlEmail: text,
        ...options,
      }).sendEmail(),
    );
  }
  await Promise.all(mails);
}
