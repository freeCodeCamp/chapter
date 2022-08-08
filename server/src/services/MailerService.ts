import { inspect } from 'util';

import sendgrid from '@sendgrid/mail';
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
  emailUsername?: string;
  emailPassword?: string;
  emailService?: string;
  emailHost?: string;
  sendgridKey?: string;
  sendgridEmail?: string;
  iCalEvent?: string;

  constructor(data: MailerData) {
    this.emailList = data.emailList;
    this.subject = data.subject;
    this.htmlEmail = data.htmlEmail;
    this.backupText = data.backupText || '';
    this.iCalEvent = data.iCalEvent;

    // to be replaced with env vars
    this.ourEmail = process.env.CHAPTER_EMAIL || 'ourEmail@placeholder.place';
    this.emailUsername = process.env.EMAIL_USERNAME || 'project.1';
    this.emailPassword = process.env.EMAIL_PASSWORD || 'secret.1';
    this.emailService = process.env.EMAIL_SERVICE;
    this.emailHost = process.env.EMAIL_HOST || 'localhost';

    this.sendgridKey = process.env.SENDGRID_KEY;
    this.sendgridEmail = process.env.SENDGRID_EMAIL;

    if (process.env.NODE_ENV !== 'production') {
      this.createTransporter();
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

  public async sendEmail(): Promise<SentMessageInfo> {
    try {
      if (process.env.NODE_ENV !== 'production') {
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
      } else {
        if (!this.sendgridKey || !this.sendgridEmail) {
          throw new Error(
            'Missing Sendgrid variables and environment is set to production.',
          );
        }
        sendgrid.setApiKey(this.sendgridKey);
        for (const email of this.emailList) {
          const opts = {
            to: email,
            from: this.sendgridEmail,
            subject: this.subject,
            html: this.htmlEmail,
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
          if (this.iCalEvent) {
            const attachment = {
              filename: 'calendar.ics',
              name: 'calendar.ics',
              content: this.iCalEvent,
              disposition: 'attachment',
              type: 'text/calendar; method=REQUEST',
            };
            Object.assign(opts, { attachments: [attachment] });
          }
          await sendgrid.send(opts);
        }
      }
    } catch (e) {
      // We need to inspect, since mail error objects are often quite deep.
      console.log('Email failed to send. ', inspect(e, false, null));
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
