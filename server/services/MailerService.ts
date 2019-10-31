import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import { IMailerService } from 'types/services';
import Utilities from 'server/util/Utilities';

// @todo add ourEmail, emailUsername, emailPassword, and emailService as
// environment variables when they become available. Temporary placeholders
// provided until updated info available.
export default class MailerService implements IMailerService {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText: string;
  transporter: Transporter;
  ourEmail: string;
  emailUsername: string;
  emailPassword: string;
  emailService: string;

  constructor(
    emailList: Array<string>,
    subject: string,
    htmlEmail: string,
    backupText?: string,
  ) {
    this.emailList = emailList;
    this.subject = subject;
    this.htmlEmail = htmlEmail;
    this.backupText = backupText || '';

    // to be replaced with env vars
    this.ourEmail = process.env.CHAPTER_EMAIL as string;
    this.emailUsername = process.env.EMAIL_USERNAME as string;
    this.emailPassword = process.env.EMAIL_PASSWORD as string;
    this.emailService = process.env.EMAIL_SERVICE as string;

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
      auth: {
        user: this.emailUsername,
        pass: this.emailPassword,
      },
    });
  }

  public async sendEmail(): Promise<SentMessageInfo> {
    try {
      return await this.transporter.sendMail({
        from: this.ourEmail,
        to: this.emailList,
        subject: this.subject,
        text: this.backupText,
        html: this.htmlEmail,
      });
    } catch (e) {
      console.log('Email failed to send. ', e);
    }
  }
}
